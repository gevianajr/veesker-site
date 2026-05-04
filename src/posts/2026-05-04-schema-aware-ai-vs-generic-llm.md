---
title: "Schema-aware AI: why generic LLMs fail at PL/SQL"
description: "Generic LLMs know just enough Oracle to be dangerous — wrong CONNECT BY rewrites, broken MERGE syntax, stripped hints, and bind variables replaced with concatenation."
date: "2026-05-04"
slug: "schema-aware-ai-vs-generic-llm"
lang: "en"
kind: "deep-dive"
tags: ["oracle", "plsql", "ai", "schema-aware", "developer-tools"]
translation_slug: "ia-com-schema-vs-llm-generico"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

The Oracle developer experience with generic AI follows a familiar arc: you paste a query, the model returns something that looks plausible at a glance, you run it, and Oracle either rejects it immediately or accepts it and produces results four times slower than your original. The model was confident. The model was wrong in ways that only surface when you know the full context — the schema, the Oracle version, the optimizer state, the intention behind the query.

That mismatch has a name: **lack of grounding**. And it explains almost every practical failure mode when you bring a generic LLM into a PL/SQL workflow.

## What "grounding" means in this context

A grounded AI assistant knows the environment it is operating in. For an Oracle developer, that means:

- The **schema**: actual table names, column types, constraints, foreign keys — not a generic guess.
- The **server version**: 11g, 19c, 23ai. The syntax rules change. The available functions change. The optimizer behavior changes.
- The **intent**: are you trying to minimize CPU, reduce parse time, handle a large rowset, or work around a known optimizer defect?

A generic LLM trained on the public web has seen a lot of SQL. But it has seen far more Postgres and MySQL than Oracle, and within Oracle it has seen more Stack Overflow answers than production codebases. What it has not seen is *your* schema, *your* version, *your* specific combination of data distribution and index coverage. And those are precisely the things that determine whether a query works.

## CONNECT BY and the recursive CTE trap

Oracle's hierarchical query syntax predates the SQL standard recursive CTE (`WITH ... AS (... UNION ALL ...)`). Both can express tree traversal. They are not interchangeable in practice.

A typical `CONNECT BY PRIOR` query on a ten-million-row adjacency list:

```sql
SELECT employee_id, manager_id, LEVEL,
       SYS_CONNECT_BY_PATH(last_name, '/') AS path
FROM   employees
START WITH manager_id IS NULL
CONNECT BY PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;
```

Ask a generic LLM to "modernize" this and you will receive a recursive CTE. The CTE is semantically equivalent — with caveats — but on Oracle's cost-based optimizer, the `CONNECT BY` path frequently hits specialized internal execution plans that the CTE path cannot use. The `ORDER SIBLINGS BY` clause, which orders siblings at each level of the hierarchy without collapsing the tree structure, has no clean equivalent in a CTE. The model either drops it silently or produces something that sorts differently.

The model is not wrong to suggest a CTE. It is wrong to suggest it as a straightforward "modernization" without measuring the plan difference against the specific table size and index structure. A correct recommendation requires knowing the version (Oracle 11g handles recursive CTEs less efficiently than 19c) and running `EXPLAIN PLAN` on both before committing to the change.

## MERGE syntax: version-specific, easy to break

Oracle's `MERGE` statement is notoriously sensitive to version. The base form has been stable since 9i, but the `DELETE` clause in the `WHEN MATCHED` branch, the position of the `WHERE` predicate, and the handling of `DEFAULT` values in `WHEN NOT MATCHED` have all evolved across major releases.

A generic LLM, asked to produce a `MERGE` to upsert a staging table into a production table on 11g, frequently generates:

```sql
-- This does NOT parse on Oracle 11g
MERGE INTO target t
USING source s ON (t.id = s.id)
WHEN MATCHED THEN
  UPDATE SET t.val = s.val WHERE s.active = 1 DELETE WHERE t.obsolete = 1
WHEN NOT MATCHED BY TARGET THEN
  INSERT (t.id, t.val) VALUES (s.id, s.val);
```

The `BY TARGET` qualifier in `WHEN NOT MATCHED` comes from T-SQL's `MERGE` syntax. Oracle does not use it. The inline `DELETE` placement after the `WHERE` predicate on the `UPDATE` branch is also wrong for 11g — the `DELETE` clause must follow the full `UPDATE` clause in a specific position. On 19c, the permissible structure shifts again.

A version-aware assistant would refuse to generate Oracle `MERGE` syntax without first confirming the target database version. A generic one will generate something confidently that fails at parse time — or worse, that parses and behaves incorrectly because the semantics are not what they appear.

## Optimizer hints: the ones you earned

Oracle's hint syntax is a first-class, documented feature. Hints like `/*+ INDEX(t MY_IDX) */`, `/*+ USE_NL(a b) */`, or `/*+ PARALLEL(8) */` are not deprecated or a sign of poor practice. They are the mechanism by which a DBA communicates directly with the cost-based optimizer when the statistics-derived plan is suboptimal for a known data distribution.

A generic LLM, asked to clean up or rewrite a hinted query, will frequently remove the hints. The model's training corpus contains a significant volume of advice suggesting that hints are a workaround for deficient statistics management, and it generalizes that into removing them outright. On a warehouse query where the hints were hard-won over weeks of tuning, that removal is destructive. The query without the hint may be twice as slow, or it may choose a full-table scan on a 500-million-row table.

Worse: when the model does preserve hints, it often positions them incorrectly. `SELECT /*+ FULL(t) */ ...` works. `SELECT ... FROM t /*+ FULL(t) */` does not. Hint placement is rigid in Oracle, and the model frequently introduces subtle positioning errors that cause Oracle to silently ignore the hint rather than raise an error — which means the query runs, the plan is wrong, and nothing tells you why.

## Bind variables: the regression that looks like a simplification

Bind variables exist for two reasons: security (preventing SQL injection) and parse efficiency (a parsed plan is cached against the bind variable template, not recomputed for every literal value). Any Oracle application with significant query throughput depends on bind variable reuse to keep parse overhead manageable.

A generic LLM, asked to simplify or translate a PL/SQL block, will frequently rewrite bind variable references as string concatenation:

```sql
-- Original (correct)
EXECUTE IMMEDIATE
  'SELECT count(*) FROM orders WHERE status = :1'
  INTO v_count USING p_status;

-- Rewritten by a generic LLM (wrong)
EXECUTE IMMEDIATE
  'SELECT count(*) FROM orders WHERE status = ''' || p_status || ''''
  INTO v_count;
```

The model is pattern-matching from training data where string concatenation is the dominant idiom. In an Oracle OLTP environment, this rewrite triggers hard parse storms on high-traffic paths and opens injection vulnerabilities when `p_status` originates from user input. The model does not know that `p_status` is externally supplied. It does not know that your application executes this query a thousand times per second. It sees only the local code block in isolation.

## The architecture of schema-aware AI

Fixing these failure modes requires the assistant to know things that are not present in the prompt text:

1. **The schema** — retrieved live from the connected Oracle instance, not inferred from the query.
2. **The version** — read from the connection header at connect time, used to gate available syntax and hint semantics.
3. **The plan** — running `EXPLAIN PLAN` on candidate rewrites before presenting them, and comparing costs.
4. **Intent preservation** — recognizing that a hint, a bind variable, or a `CONNECT BY` clause is there for a specific reason before touching it.

Veesker's local AI layer implements the first two today. When the AI context window is populated for a session, it includes the real table definitions from the connected schema — pulled from `ALL_TABLES`, `ALL_COLUMNS`, `ALL_CONSTRAINTS` — and the server version string detected at connection time. The model cannot hallucinate column names that do not exist, and it knows whether `JSON_VALUE` or `VECTOR_DISTANCE` is available in the current version before suggesting either.

The third and fourth — plan-based feedback and deeper intent tracking — are part of the Cloud layer, planned for H2 2026. The design is to run `EXPLAIN PLAN` transparently on candidate rewrites and surface the cost delta in the suggestion UI, so the developer can see whether the AI's proposed change makes the plan cheaper or more expensive before accepting it.

Until that lands, the safest use of any AI assistant in a PL/SQL context is the same use you would make of a knowledgeable colleague: review its output carefully, run the plan, and distrust confidence where it is not backed by measurement. A grounded assistant makes fewer confident mistakes. An ungrounded one is fast and wrong in ways that are hard to see until production tells you otherwise.

---

Download the Community Edition and connect your Oracle schema — the AI knows what version it is talking to: [veesker.cloud/download](/download).

— *Veesker*
