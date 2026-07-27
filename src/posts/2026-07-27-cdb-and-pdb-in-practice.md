---
title: "CDB and PDB in practice: how Veesker navigates pluggable database hierarchies"
description: "Oracle's multi-tenant architecture turns a single server into dozens of isolated databases — here's how Veesker surfaces that hierarchy without cluttering every query session."
date: "2026-07-27"
slug: "cdb-and-pdb-in-practice"
lang: "en"
kind: "deep-dive"
tags: ["oracle", "cdb", "pdb", "multitenant", "architecture"]
translation_slug: "cdb-e-pdb-na-pratica"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

Oracle's multi-tenant container database architecture arrived in 12c and has been the default for new installations since 21c. In 23ai, creating a non-CDB database is something Oracle explicitly discourages. If you're connecting to any Oracle instance deployed in the last five years, there's a real chance it's a CDB — and whether you know it or not, that changes what you're actually connected to.

This post covers how the CDB/PDB hierarchy works in practice, what that means for daily query and admin work, and how Veesker maps the architecture into the connection UI without making it a tax on every session.

## What a CDB actually is

The Container Database is a single Oracle instance — one set of background processes, one SGA, one set of redo logs — that hosts one or more Pluggable Databases. The CDB has its own root container, called `CDB$ROOT`, which owns the Oracle metadata catalog, the data dictionary, and the common user accounts that span all containers. Every PDB within that CDB is an isolated, self-contained database with its own tablespaces, local users, local objects, and its own network service.

The key word is *isolated*. A PDB looks like an ordinary pre-12c Oracle database from the application's perspective. An APEX form, a legacy JDBC connection string, an ERP system — none of them need to know they're running inside a CDB. They connect to a PDB service name, they get a session scoped entirely to that PDB, and the rest of the CDB is invisible to them.

The isolation is not just logical. Tablespace files are separate. Schema objects in one PDB cannot reference objects in another without an explicit database link. A `DROP TABLE` in PDB-A has no effect on PDB-B.

Where the architecture becomes directly relevant is when you're working *across* the hierarchy — inspecting all PDBs from the root, comparing object counts, administering containers, checking container-level wait events, or writing queries that need the `CDB_` prefix views.

## Connecting: CDB root vs PDB service

Oracle exposes both the CDB root and each individual PDB as a network service. How you connect determines your starting container and what you can see.

Connecting to the CDB root service opens a session in `CDB$ROOT`. You can query `V$PDBS` to see all pluggable databases and their status, and if you hold the `SET CONTAINER` privilege, switch your session to any PDB with a single statement:

```sql
ALTER SESSION SET CONTAINER = MYPDB;
```

After that, your session behaves exactly as if you'd connected to MYPDB directly. No reconnect, no new credentials — a context switch. This is the right approach for admin tasks where one connection needs to roam across containers.

Connecting to a PDB service name directly gives you a session scoped to that PDB with no visibility into sibling PDBs. This is the correct mode for application connections and developers doing schema work in a specific database. Simpler, more contained, and appropriate for anyone who doesn't need to know the CDB exists.

## The view taxonomy: CDB_, DBA_, V$

Before 12c, the `DBA_*` views were the authoritative catalog. In a CDB environment those views still exist, but their scope is the *current container*. Connected to a PDB and querying `DBA_TABLES`? You see tables in that PDB. Connected to `CDB$ROOT` and querying `DBA_TABLES`? You see tables in the root only.

Oracle added the `CDB_*` view family to give cross-container visibility. `CDB_TABLES` is `DBA_TABLES` with a `CON_ID` column identifying which container each row belongs to. The following query, run from a CDB root session, shows the total developer-owned object count per pluggable database:

```sql
SELECT
    p.name,
    COUNT(o.object_name) AS object_count
FROM
    cdb_objects o
    JOIN v$pdbs p ON o.con_id = p.con_id
WHERE
    o.oracle_maintained = 'N'
GROUP BY
    p.name
ORDER BY
    object_count DESC;
```

This requires a root session with `SELECT ANY DICTIONARY` or an appropriate common-user privilege. It does not work from a PDB session — a common source of `ORA-02030: can only select from fixed tables/views` when someone tries to run a cross-container admin script from an application connection.

## What Veesker does with this

Every Veesker connection performs a version handshake immediately after the OCI session is established. On 12c and later, Veesker issues a follow-up query to determine whether the instance is a CDB and which container the session is in:

```sql
SELECT cdb, con_id, con_name FROM v$database
```

If `CDB = 'YES'`, the instance is multi-tenant. `CON_ID = 1` means the session is in `CDB$ROOT`. `CON_ID > 1` means the session landed in a PDB.

The object tree reflects this. A `CDB$ROOT` connection shows the CDB node at the top level, with PDB children listed beneath it. Each PDB in the tree can be expanded to inspect its schemas without switching containers — Veesker issues cross-container queries using the `CDB_` view family behind the scenes, but surfaces the results per-PDB to match how you'd think about the hierarchy.

For developer connections that land in a PDB, the tree is flat: no CDB overhead, no container noise. The developer sees exactly what the PDB contains.

The SQL context carries the same awareness. If you're in a CDB root session, the container name and version are part of what Veesker passes to the AI layer. A query referencing `CDB_SEGMENTS` will receive a suggestion to filter by `CON_ID`. A query against `DBA_TABLES` in a root session will note the scope and suggest whether you want the `CDB_` equivalent instead.

## Container switching in the UI

For `CDB$ROOT` connections, Veesker exposes a container picker in the session toolbar. Selecting a PDB issues `ALTER SESSION SET CONTAINER`, refreshes the breadcrumb at the top of the session, and updates the object tree to show the target container. The query history stays in the tab; only the container context changes.

This is not a substitute for saved per-PDB connection profiles — for persistent work in a specific PDB, a dedicated saved connection is still the cleaner answer. But for an admin who needs to inspect three PDBs in sequence, container switching avoids opening three separate connection panels.

## Common gotchas

**Common users vs local users.** Common users (prefixed `C##` in 12c through 21c — the requirement is relaxed in 23ai) exist in `CDB$ROOT` and propagate to all PDBs. Local users exist only in the PDB where they were created. If you need a DBA account that can switch containers, it must be a common user created from the root. Creating a user in a PDB session produces a local user, silently, which then cannot issue `ALTER SESSION SET CONTAINER`. Veesker labels users in the object tree as common or local to make this visible before you build on the wrong assumption.

**PDB open mode.** PDBs can be `READ WRITE`, `READ ONLY`, or `MOUNTED`. A PDB in `MOUNTED` mode rejects connections with `ORA-01033`, which looks like a generic startup error rather than a container state issue. Veesker checks `V$PDBS` on CDB root connections and marks PDBs that are not in `READ WRITE` mode with a status indicator in the tree before you attempt to connect to them.

**Service names.** In EZConnect form, `host:port/service_name` connects to whatever the listener advertises for that name. Most environments create one service per PDB at provisioning time. If you're not sure which container a service name resolves to, Veesker's connection test reports the container name from the `V$DATABASE` handshake result before the profile is saved.

## How version gating works

The CDB/PDB UI in Veesker is conditional on the server version. On 11g and earlier, the tree is flat, the `CDB_` views don't exist, and the multi-tenant UI doesn't appear. On 12c and later, the hierarchy renders. On 23ai — where non-CDB instances are deprecated — Veesker assumes multi-tenant by default.

If you manage a mixed estate with 11g instances alongside 19c CDBs and 23ai deployments, each connection behaves correctly for the version the server reports. There is no setting to toggle. The handshake determines the UI, not a configuration file.

That version-aware behavior is part of what makes a multi-version mixed estate workable in a single tool. The alternative is using different tools per version, or disabling UI features across the board to keep the interface consistent on the lowest common denominator. Neither is a good trade.

---

Veesker's Community Edition handles CDB and PDB connections, the container-aware object tree, and the multi-tenant SQL context under Apache 2.0 — no Cloud subscription required. [Download Veesker](/download) and connect to your Oracle estate as it actually is.

— *Veesker*
