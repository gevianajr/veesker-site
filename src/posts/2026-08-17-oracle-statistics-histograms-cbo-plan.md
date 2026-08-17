---
title: "Oracle statistics and histograms: why the CBO's plan changes when you gather stats"
description: "A technical walkthrough of how Oracle's Cost-Based Optimizer uses table statistics and column histograms to choose execution plans — and why gathering stats changes the plan."
date: "2026-08-17"
slug: "oracle-statistics-histograms-cbo-plan"
lang: "en"
kind: "deep-dive"
tags: ["oracle", "cbo", "statistics", "histograms", "query-tuning"]
translation_slug: "oracle-estatisticas-histogramas-plano-cbo"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

The Oracle Cost-Based Optimizer has been the default execution planner since Oracle 7. Every query you run passes through it. It reads your SQL, models possible execution plans, assigns a cost to each, and picks the cheapest one. The word "cheapest" is measurable here: it is a formula involving estimated row counts, physical I/O, and CPU cycles.

The word that matters most in that sentence is **estimated**. The CBO does not execute the query to see how many rows it will return. It estimates, based on statistics it has gathered about your tables, columns, and indexes. Those statistics are the input to the optimizer's decisions. When the statistics are accurate, the optimizer makes good decisions. When they are stale, absent, or simply do not capture the shape of your data, the optimizer makes decisions that look reasonable on paper and are catastrophically wrong in practice.

This post explains the shape of that problem, why histograms are the most important part of the statistics picture, and what happens — plan change and all — when you call `DBMS_STATS.GATHER_TABLE_STATS`.

## What the optimizer actually reads

Oracle stores optimizer statistics in the data dictionary. The core views are `DBA_TABLES`, `DBA_TAB_COLUMNS`, `DBA_INDEXES`, and their `ALL_` and `USER_` equivalents. The key figures for a table are:

- **NUM_ROWS** — estimated total row count
- **BLOCKS** — number of data blocks the table occupies
- **AVG_ROW_LEN** — average row length in bytes
- **LAST_ANALYZED** — timestamp of the last statistics gather

For each column the optimizer tracks:

- **NUM_DISTINCT** — number of distinct values
- **LOW_VALUE / HIGH_VALUE** — min and max values, stored in raw format
- **NUM_NULLS** — count of null values
- **DENSITY** — a selectivity estimate for a single-value predicate (simplified: 1/NUM_DISTINCT for uniform data)
- **HISTOGRAM** — a bucket structure describing the actual data distribution, if one was built

Without a histogram, the optimizer assumes data is uniformly distributed across the column's value range. For many columns that assumption holds. For many others it is completely wrong.

## Histograms: what they are and when they matter

A histogram is a compressed representation of column value distribution. Oracle supports several types:

- **FREQUENCY histogram** — one bucket per distinct value; used when NUM_DISTINCT is small enough to fit within the bucket limit
- **HEIGHT-BALANCED histogram** — a legacy type from earlier versions; each bucket contains approximately the same number of rows
- **HYBRID histogram** — introduced in 12c; combines frequency buckets for popular values with equal-height buckets for the rest of the range
- **TOP-FREQUENCY histogram** — also from 12c; captures the top N most common values when NUM_DISTINCT exceeds the bucket limit

The difference between "histogram present" and "histogram absent" matters most when the column has **data skew**: a small number of values appear far more often than the rest.

Consider an `ORDERS` table with a `STATUS` column containing six distinct values: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED`. Suppose 98% of your rows are `DELIVERED` or `CANCELLED`, and only 2% are in the other four statuses.

Without a histogram, the optimizer assumes each status represents 1/6 of the rows (about 16.7% selectivity). A query for `WHERE STATUS = 'PENDING'` is estimated at 16.7% of the table. The optimizer treats that as a significant fraction and may choose a full table scan.

With a histogram, the optimizer knows `PENDING` represents 0.3% of rows. The selectivity estimate drops dramatically. The optimizer considers an index scan viable — and almost certainly uses one.

The reverse case matters equally. A query for `WHERE STATUS = 'DELIVERED'` without a histogram also gets the 16.7% estimate. With a histogram, the optimizer sees that it will touch 60% of the table and plans a full scan. That is the correct choice.

Histograms do not just influence one step. A wrong row estimate at one node propagates through the entire plan tree: wrong memory grants for hash joins, wrong sort memory, wrong parallel degree selection, wrong partition pruning. The downstream damage from a single bad estimate at a filter node can ripple into every join and aggregation above it.

## What gathering statistics actually changes

When you call `DBMS_STATS.GATHER_TABLE_STATS`, Oracle does the following:

1. Scans a sample of the table's data (by default using `AUTO_SAMPLE_SIZE`, which Oracle computes to balance accuracy and speed)
2. Computes table-level counts: `NUM_ROWS`, `BLOCKS`, `AVG_ROW_LEN`
3. Computes per-column statistics: `NUM_DISTINCT`, `LOW_VALUE`, `HIGH_VALUE`, `NUM_NULLS`, `DENSITY`
4. Decides whether to build a histogram for each column based on the `METHOD_OPT` parameter (default: `FOR ALL COLUMNS SIZE AUTO`)
5. Writes all of this to the data dictionary
6. Optionally invalidates cached execution plans that depend on the affected table

The plan changes when the new statistics reveal a data shape different from what the optimizer previously assumed.

The most common scenario: statistics were gathered years ago. The data has grown and skewed significantly since then. The optimizer has been running plans based on stale estimates for months. When you gather fresh statistics, the optimizer sees `NUM_ROWS` updated from 1 million to 40 million, and sees histograms that reveal 80% of rows clustering in three status values. The plan that ran in 200ms with the old statistics might drop to 50ms with accurate ones — or the reverse, if the old plan was accidentally optimal and the new statistics reveal structural problems in the query.

## The DBMS_STATS interface in practice

A basic table statistics gather:

```sql
BEGIN
  DBMS_STATS.GATHER_TABLE_STATS(
    ownname          => 'HR',
    tabname          => 'EMPLOYEES',
    estimate_percent => DBMS_STATS.AUTO_SAMPLE_SIZE,
    method_opt       => 'FOR ALL COLUMNS SIZE AUTO',
    cascade          => TRUE   -- also gathers index statistics
  );
END;
/
```

To inspect what histograms were built:

```sql
SELECT column_name,
       histogram,
       num_buckets,
       last_analyzed
FROM   dba_tab_col_statistics
WHERE  owner      = 'HR'
AND    table_name = 'EMPLOYEES'
ORDER  BY column_name;
```

The `histogram` column returns `NONE`, `FREQUENCY`, `HEIGHT BALANCED`, `HYBRID`, or `TOP-FREQUENCY`. A `NONE` value on a column used in a selective predicate is worth investigating.

To observe the plan change directly, use `EXPLAIN PLAN` before and after the gather:

```sql
EXPLAIN PLAN FOR
  SELECT * FROM hr.employees WHERE department_id = 50;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

The `E-Rows` column in the plan output is the optimizer's row count estimate at each step. Run this before gathering stats, gather, then run it again. The difference in `E-Rows` is exactly what the statistics change produced. If the actual row counts (from `GATHER_PLAN_STATISTICS` or `V$SQL_PLAN_STATISTICS_ALL`) diverge significantly from the estimates, you have a statistics quality problem.

## Where stale statistics hide

The most common cases where stale statistics cause real execution plan damage:

**Bulk loads.** An ETL job inserts 10 million rows overnight. Stale stats mean the optimizer still plans against last night's row count. The next morning's reports run with plans built for a fraction of the actual data.

**Purge operations.** A delete removes 80% of a table's rows. The optimizer continues planning as if those rows exist. Index range scans that should now be full scans are still issued as full table scans.

**Partition truncation.** Partition-level statistics are not automatically refreshed when you truncate a partition. The global table stats may still reflect the old partition count.

**New schema objects.** A new table or index starts with no statistics at all. Oracle falls back to defaults: 0 rows, 8 blocks, guessed density. Plans for freshly created tables are almost always wrong until the first explicit gather.

Dynamic sampling (`OPTIMIZER_DYNAMIC_SAMPLING`) mitigates some of these cases by sampling data at parse time, but it adds per-parse overhead and is not a substitute for maintained statistics on busy tables.

## Locking statistics to prevent surprises

Once you have a known-good plan tied to a specific statistics state, you can lock those statistics with `DBMS_STATS.LOCK_TABLE_STATS`. This prevents automatic statistics maintenance jobs from changing the optimizer's input for that table.

Locking is useful when:
- You have manually set statistics to match a specific data distribution (using `DBMS_STATS.SET_COLUMN_STATS`)
- You need plan stability across a release window where data volumes are changing
- The auto-sample cannot gather a meaningful histogram in the available maintenance window

Locking statistics after a deliberate gather is a valid stability tool. Locking instead of gathering — to avoid plan changes — is a way of hiding the real problem rather than fixing it.

## Statistics visibility in Veesker

Veesker's schema browser surfaces `LAST_ANALYZED` directly in the table metadata panel. When you select a table in the object tree, you see the statistics age without writing a query to `DBA_TAB_STATISTICS`. The AI layer in Veesker factors histogram presence into its tuning suggestions: when a column used in a filter predicate shows `histogram = NONE` in `DBA_TAB_COL_STATISTICS`, the suggestion includes a targeted `DBMS_STATS` call as a prerequisite rather than assuming the statistics are adequate.

Veesker Community Edition is free under Apache 2.0, and it works on the full range of Oracle versions from 9i through 26ai. The Cloud layer — coming H2 2026, with founder pricing at $29 USD per seat per month locked for waitlist members — adds AI-assisted `EXPLAIN PLAN` interpretation and statistics health monitoring across connected instances.

If you are debugging a plan regression after a statistics gather, or working with a schema where `LAST_ANALYZED` shows 2019, [download Veesker](/download) and bring the optimizer's inputs into view.

— *Veesker*
