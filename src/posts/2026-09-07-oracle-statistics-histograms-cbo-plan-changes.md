---
title: "Oracle statistics and histograms: why the CBO's plan changes when you gather stats"
description: "A precise look at how Oracle's cost-based optimizer uses statistics and histograms to estimate cardinality, and why gathering — or mis-gathering — stats changes every plan downstream."
date: "2026-09-07"
slug: "oracle-statistics-histograms-cbo-plan-changes"
lang: "en"
kind: "deep-dive"
tags: ["oracle", "cbo", "statistics", "histograms", "performance"]
translation_slug: "oracle-estatisticas-histogramas-cbo-mudanca-plano"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

A query runs in 200 ms every day for six months. Then someone gathers statistics overnight and it takes 45 seconds the next morning. The SQL did not change. The data did not change meaningfully. The plan changed, and it changed because the optimizer now believes something different about the shape of the data.

Understanding why requires understanding what Oracle's cost-based optimizer (CBO) actually does with statistics — not the high-level story ("fresh stats = good plan"), but the specific chain from raw numbers to plan selection. Once that chain is visible, the behavior stops being mysterious and starts being predictable.

## What statistics the CBO is actually reading

Oracle maintains statistics at three levels: table, column, and index. Each has a different role in plan selection.

**Table statistics** give the optimizer the overall scale: how many rows (`NUM_ROWS`), how many blocks the table occupies (`BLOCKS`), and average row length (`AVG_ROW_LEN`). The block count feeds directly into the full-table scan cost model. A table with 100,000 blocks and a full scan path costs roughly 100,000 logical I/Os, which the optimizer scales against its `DB_FILE_MULTIBLOCK_READ_COUNT` estimate to arrive at a relative cost.

**Column statistics** cover `NUM_DISTINCT` (distinct value count, or NDV), `LOW_VALUE`, `HIGH_VALUE`, `NUM_NULLS`, and `DENSITY`. The optimizer uses these to estimate selectivity — the fraction of rows a predicate will return — which it then multiplies against `NUM_ROWS` to get a cardinality estimate. That cardinality estimate is the single number that determines join order, join method, and operation choice.

**Index statistics** cover `BLEVEL` (the B-tree depth), `LEAF_BLOCKS`, `DISTINCT_KEYS`, and `CLUSTERING_FACTOR`. The clustering factor measures how ordered the table rows are relative to the index order: a low clustering factor means most index range scans can be satisfied with a small number of table block accesses; a high clustering factor means every index entry potentially lives in a different block, making an index scan more expensive than a full scan past a small row fraction.

You can read the current state of all three levels from `DBA_TAB_STATISTICS`, `DBA_TAB_COL_STATISTICS`, and `DBA_IND_STATISTICS`.

## The selectivity chain and why NDV is the pivot

For a column with no histogram, the optimizer assumes uniform distribution. A predicate `WHERE status = 'CLOSED'` on a column with `NUM_DISTINCT = 5` gets a selectivity of `1 / NDV = 0.2`. Applied against 1,000,000 rows, that is an estimated 200,000 rows returned — which will almost certainly push the optimizer toward a full scan or a hash join on the child side.

If the actual data has `status = 'CLOSED'` accounting for 95% of rows and `status = 'ACTIVE'` for the remaining 5%, the uniform assumption is badly wrong in one direction for a filter on `ACTIVE` (estimated 200,000 rows, actual ~50,000) and in the other direction for `CLOSED` (estimated 200,000, actual ~950,000). The join method chosen, the memory allocated for hash joins, the decision to broadcast or redistribute in a parallel plan — all of these follow from the cardinality estimate.

This is the problem histograms exist to solve.

## Histogram types and when each applies

Oracle 12c consolidated histogram creation into `DBMS_STATS.GATHER_TABLE_STATS` with the `METHOD_OPT` parameter. The default `FOR ALL COLUMNS SIZE AUTO` lets Oracle decide which columns get histograms and how many buckets to use. Understanding what it decides and why is not optional if you want predictable plan behavior.

**Frequency histograms** are created when `NUM_DISTINCT` is at or below the number of histogram buckets requested (up to 2048). Each distinct value gets its own bucket with an exact row count. For the `status` example with five distinct values, Oracle can record exactly: `ACTIVE → 50,000 rows`, `CLOSED → 950,000 rows`, and so on. The optimizer then uses the exact count rather than `NUM_ROWS / NDV`. Selectivity for `WHERE status = 'ACTIVE'` becomes `50,000 / 1,000,000 = 0.05`, and the plan reflects that.

**Top-frequency histograms** were introduced in 12c for the case where `NUM_DISTINCT` exceeds the bucket limit but the distribution is heavily skewed toward a manageable number of popular values. Oracle records the most frequent values exactly, and groups the tail into a single "other" bucket. The column's `HISTOGRAM` column in `DBA_TAB_COL_STATISTICS` will show `TOP-FREQUENCY`.

**Height-balanced histograms** (legacy, still generated in some conditions pre-12c) divide the value range into equal-height buckets where each bucket holds approximately the same number of rows. The endpoint values mark boundaries. These are less precise for skewed data than frequency or top-frequency histograms and are less commonly generated in current releases.

**Hybrid histograms** are the default in 12c and later when `NUM_DISTINCT` exceeds the bucket limit but top-frequency does not apply cleanly. They combine a height-balanced structure with exact frequencies for the popular values that fall at bucket endpoints. The practical effect is better selectivity estimates for skewed high-cardinality columns than height-balanced alone provides.

The type Oracle selects is stored in `DBA_TAB_COL_STATISTICS.HISTOGRAM`. When troubleshooting a plan change, checking whether the histogram type changed between two stats-gathering runs is as important as checking whether `NUM_ROWS` changed.

## When gathering stats changes a plan

The common triggers for plan changes after a stats gather are:

**NDV changes.** A new ETL load adds a previously unseen value to a column that previously had 10 distinct values. NDV goes from 10 to 11. The uniform-distribution selectivity shifts slightly, but more importantly, if the column was at the frequency-histogram threshold, Oracle may now choose a different histogram type.

**Histogram creation or deletion.** `METHOD_OPT => 'FOR ALL COLUMNS SIZE AUTO'` creates histograms where Oracle detects skew, and drops them where it does not. A column that had a frequency histogram last week may not have one this week if the skew Oracle measured fell below its internal threshold. A query that relied on the optimizer knowing that `type = 'VOID'` is rare will suddenly receive the uniform-distribution estimate and choose a different join strategy.

**Clustering factor shifts.** After a large delete-and-reinsert of rows, the physical ordering of table rows relative to an index can change substantially. A clustering factor that was 50,000 can become 800,000 after a bulk reload that did not preserve the insert order. Indexes that were previously cost-effective for range scans become expensive, and the optimizer switches to full scans.

**Stale statistics on one side of a join.** If table A has current stats showing 10,000 rows and table B has stale stats still showing 100,000 rows (when it actually has 5,000 after a partition truncation), the join order the optimizer selects will be inverted from optimal. The row estimate for the driving side is wrong, and every operation downstream inherits that error.

## Controlling stats gathering without surprises

The `DBMS_STATS` package gives enough control to prevent most unpleasant surprises.

**Pending statistics** let you gather into a staging area and publish explicitly. `DBMS_STATS.SET_TABLE_PREFS(owner, table_name, 'PUBLISH', 'FALSE')` causes subsequent gathers to write to `USER_TAB_PENDING_STATS` rather than the live dictionary. You can test queries against pending stats by setting `OPTIMIZER_USE_PENDING_STATISTICS = TRUE` at the session level, confirm the plans are acceptable, and then publish with `DBMS_STATS.PUBLISH_PENDING_STATS`. Regressing a plan on a production system during a business window is avoidable — this is the mechanism that avoids it.

**Locking statistics** (`DBMS_STATS.LOCK_TABLE_STATS`) prevents automatic gathering from overwriting stats you have manually set or verified. Useful for small lookup tables where you know the distribution is stable and auto-gather would replace good stats with sampled estimates.

**Incremental statistics for partitioned tables** avoid gathering the entire table when only a few partitions changed. Setting `INCREMENTAL => TRUE` and `PUBLISH => TRUE` in the table preferences tells Oracle to derive global statistics from partition-level stats, gathering only on partitions whose `STALE_STATS` column is `YES`. On large partitioned tables, this is the difference between a 30-minute global gather and a 2-minute incremental one.

**No-invalidate control.** The `NO_INVALIDATE` parameter on `GATHER_TABLE_STATS` controls whether existing cursors in the shared pool are immediately invalidated or allowed to age out. Setting `NO_INVALIDATE => DBMS_STATS.AUTO_INVALIDATE` (the default) lets Oracle stagger cursor invalidation to prevent a stampede. For a stats gather you want to take effect immediately, `NO_INVALIDATE => FALSE` forces it; for one you want to evaluate before it affects running workloads, `NO_INVALIDATE => TRUE` defers it.

## Reading the chain in a live system

When a plan changes after a stats gather, the investigation path is:

1. Pull the previous and current stats from `DBA_TAB_STATISTICS` and `DBA_TAB_COL_STATISTICS` using `LAST_ANALYZED`. The `DBA_TAB_STATS_HISTORY` view retains a timestamped record of previous gathers, and `DBMS_STATS.RESTORE_TABLE_STATS` can restore to a specific timestamp for testing.

2. Check `HISTOGRAM` and `NUM_BUCKETS` for the columns in the predicate list. If histogram type changed, that is almost always the cause.

3. Use `EXPLAIN PLAN` or `DBMS_XPLAN.DISPLAY_CURSOR` to compare `E-Rows` (estimated) against `A-Rows` (actual from the real execution statistics). A large divergence at a specific operation identifies exactly where the optimizer's model diverged from reality.

4. If the original stats were actually producing the right plan, restore them with `DBMS_STATS.RESTORE_TABLE_STATS` and lock them while you investigate the gathering methodology.

The CBO's model is never more accurate than the statistics it reads. Getting that model right is not a one-time task; it is an operational discipline that deserves the same monitoring attention as disk space and redo log throughput.

---

Veesker surfaces per-connection EXPLAIN PLAN output directly in the editor, with `E-Rows` vs. `A-Rows` side-by-side on the plan tree. [Download the Community Edition](/download) to see it on your own Oracle estate.

— *Veesker*
