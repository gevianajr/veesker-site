---
title: "CDB and PDB in practice: how Veesker navigates pluggable database hierarchies"
description: "A practical guide to Oracle's multitenant architecture — CDB, PDB, service names, common users, and how Veesker surfaces container context at every layer."
date: "2026-08-03"
slug: "cdb-and-pdb-in-practice"
lang: "en"
kind: "deep-dive"
tags: ["oracle", "cdb", "pdb", "multitenant", "developer-tools"]
translation_slug: "cdb-e-pdb-na-pratica"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

Oracle's multitenant architecture — Container Databases and Pluggable Databases — shipped with Oracle 12c in 2013. Non-CDB mode was deprecated in Oracle 21c. Oracle 23ai and 26ai are fully multitenant. That means anyone still running Oracle today is either already on a CDB or on a migration path toward one. Yet multitenant remains one of the most consistently misunderstood parts of the Oracle stack, and most tooling does very little to help you navigate it.

This post covers how the CDB/PDB model works in practice, where developers get into trouble, and how Veesker surfaces container context at the connection layer, the object tree, and the AI layer.

## What a CDB actually is

A Container Database is Oracle's virtualization layer for database instances. It owns the physical files: the control file, the redo logs, the system tablespace. Inside it sit one or more Pluggable Databases, each with its own data dictionary, tablespaces, and user accounts — isolated from one another as if they were separate databases, but sharing the memory and background processes of the containing CDB.

Every CDB has two special containers that are always present.

**CDB$ROOT** is the root container. It holds common objects and common users. When you connect as SYSDBA without specifying a service name that maps to a particular PDB, you land here. DBA operations that span the entire CDB — patching, starting and stopping PDBs, creating common users — happen from CDB$ROOT.

**PDB$SEED** is the seed database Oracle uses when you run `CREATE PLUGGABLE DATABASE`. You cannot directly log into PDB$SEED and make changes; it is read-only by design.

Then there are the application PDBs — the containers your teams actually work in. Each has a service name, its own `SYSTEM` tablespace, its own user accounts, and complete isolation from every other PDB in the same CDB.

## Service names are the whole story

The mechanism that puts you in the right container is the service name in your connection string.

```
host:1521/ORCLPDB1
```

That trailing component after the slash is the service name. Oracle maps it to the corresponding container at connect time. If your connection string points to `ORCLPDB1`, your session opens in that PDB. If you point to `ORCL` — which is often the CDB service name on a default install — you land in CDB$ROOT.

This is where a lot of developer confusion starts. A developer has a connection to `server:1521/ORCL` that worked fine before the DBA migrated to multitenant. Post-migration, the service name `ORCL` now routes to CDB$ROOT, not to the application schema. Tables appear missing, objects do not exist, and the developer spends an hour debugging a connection that is technically correct but pointing at the wrong container.

The EZConnect format makes the mapping explicit and readable. `tnsnames.ora` aliases can obscure it if the `SERVICE_NAME` entry is out of date. Veesker stores the full EZConnect string in the connection profile so the container you connect to is always visible without opening an INI file.

## CDB$ROOT sessions: what actually changes

When you are connected to CDB$ROOT with SYSDBA, several things work differently from a normal application PDB session.

The data dictionary views have two forms. Views prefixed with `DBA_` show objects scoped to the current container. Views prefixed with `CDB_` span all open PDBs in the CDB. `DBA_TABLES` in CDB$ROOT returns tables visible from the root — mostly system objects. `CDB_TABLES` returns tables from every PDB, with a `CON_ID` column that identifies which container each row belongs to.

```sql
-- See all ORDERS tables across every open PDB
SELECT con_id, owner, table_name, num_rows
FROM   cdb_tables
WHERE  table_name = 'ORDERS'
ORDER  BY con_id;
```

Keeping `DBA_` and `CDB_` straight is essential for any DBA doing cross-PDB diagnostics or auditing. Querying `DBA_TABLES` in CDB$ROOT when you expected `CDB_TABLES` is a quiet failure: Oracle returns a result, but it is the wrong result for what you were asking.

DDL and DML by default scope to the current container. If you are in CDB$ROOT and run `CREATE TABLE`, that table lives in CDB$ROOT — almost never what you want. To switch containers inside a session, `ALTER SESSION SET CONTAINER = ORCLPDB1` works, provided you have the `SET CONTAINER` privilege. This is useful for DBA scripts that need to iterate across PDBs without opening separate connections.

Veesker makes the current container visible at all times. A CDB$ROOT session with SYSDBA gets a distinct status badge so you cannot confuse it with a PDB session when multiple tabs are open.

## Common users vs. local users

Oracle distinguishes between common users and local users based on where they were created.

**Local users** belong to a single PDB. They are created in a PDB session and cannot log into CDB$ROOT or any other PDB. The overwhelming majority of application schemas are local users: `APP_OWNER`, `REPORTING_USER`, `ETL_PROC` — all local.

**Common users** are created in CDB$ROOT and exist across every PDB in the CDB. On standard Oracle installs, their names must start with `C##` to distinguish them from local users. Common users can be granted privileges in specific containers or across all of them with the `CONTAINER=ALL` clause. A common user with `CONTAINER=ALL` DBA privileges is the canonical superuser in a multitenant deployment.

The `C##` prefix catches people off guard the first time. You run `CREATE USER MONITORING IDENTIFIED BY ...` in CDB$ROOT and Oracle raises `ORA-65096: invalid common user or role name`. The fix is either renaming the user `C##MONITORING` if a common user is the intent, or connecting to the target PDB first to create a local user with the original name.

Veesker's AI includes the current container identity in its prompt context. When you ask it to generate a `CREATE USER` statement, it produces the correct form for where you are — local user syntax in a PDB session, common user suggestions with the `C##` reminder in CDB$ROOT.

## The CONTAINERS() table function

One legitimate reason to work from CDB$ROOT is the `CONTAINERS()` table function, which lets you query an object across all open PDBs in a single statement.

```sql
SELECT con_id, owner, segment_name, bytes / 1024 / 1024 AS mb
FROM   CONTAINERS(dba_segments)
WHERE  segment_name = 'ORDERS'
ORDER  BY con_id;
```

`CONTAINERS()` is useful for auditing whether an object is consistent across all application PDBs, aggregating storage statistics across tenants, or checking that a deployment script ran correctly everywhere without switching containers one by one. The `con_id` in the result corresponds to `CON_ID` in `V$PDBS`.

This is not a pattern for application code — application connections should always target a specific PDB through its service name. But for DBA diagnostics and multi-tenant administration, `CONTAINERS()` removes a significant number of scripted `ALTER SESSION SET CONTAINER` loops.

## How Veesker surfaces all of this

Most IDE tooling treats multitenant as an afterthought: a flat object tree, no container indicator in the tab, no distinction between `DBA_` and `CDB_` views, no awareness that a `CREATE USER` from CDB$ROOT needs a different name format.

Veesker's post-connection handshake does more than read a version number. On Oracle 12c and later, it runs an additional query against `V$PDBS` to enumerate the open PDBs in the CDB. The object tree then populates with a CDB root node and PDB child nodes when your session is in CDB$ROOT. If your session is directly inside a PDB, the tree shows that PDB's schema directly — the UI matches the container you are actually in, not a generic Oracle superset.

The version gating described in the [thick-mode post](/blog/oracle-9i-to-26ai-thick-mode-auto-discovery) applies here too. On 11g and earlier, there is no CDB layer, no `V$PDBS`, no `CDB_` prefix, and Veesker does not surface UI elements for things the connected server does not have.

The AI context for any session includes the container identity, the Oracle version, and — in a CDB$ROOT session — the list of PDBs. When you ask a schema question, the model knows whether you are in an application PDB with local user scope or in CDB$ROOT with cross-PDB visibility. That distinction changes what a correct answer looks like, and the AI grounding handles it without you having to prepend it to every prompt.

## The practical takeaway

Multitenant is not a complexity you can defer by staying on old Oracle. Non-CDB mode is gone from 21c onward, and every new 23ai and 26ai install is a CDB by definition. The discipline of knowing which container you are in — and having your tooling make that clear — is not optional for anyone on current Oracle.

The service name in your connection string determines your container. The `C##` prefix distinguishes common users from local ones. The `CDB_` views span containers; `DBA_` views scope to the current one. `CONTAINERS()` is the escape hatch for cross-PDB queries from CDB$ROOT. These are not obscure edge cases; they are the daily mechanics of working on any Oracle 12c or later install.

If your current IDE shows a flat object tree with no container indication and no distinction between `DBA_` and `CDB_` views, [download Veesker](/download) and connect to your CDB. The difference is visible in the first session. Veesker is local-first, works fully offline, and ships as a single binary under Apache 2.0 for Windows, macOS, and Linux.

— *Veesker*
