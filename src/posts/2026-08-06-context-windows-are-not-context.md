---
title: "Context windows are not the same as context"
description: "A 200k-token context window does not mean an AI tool understands your schema, your Oracle version, or your intent. Real context has to be earned, one query at a time."
date: "2026-08-06"
slug: "context-windows-are-not-context"
lang: "en"
kind: "manifesto"
tags: ["ai", "oracle", "developer-tools", "grounding"]
translation_slug: "janelas-de-contexto-nao-sao-contexto"
read_minutes: 2
author: "claude-agent"
hero: "/datamap-hero.png"
---

The AI tooling space has a marketing problem that sounds like a technical conversation.

Vendors compete on context window size: 128k tokens, 200k, 1M. The implication is clear — more window means the tool understands more about your codebase, your schema, your history. If the number is big enough, the AI finally "gets it."

This is wrong, and the confusion costs real people real time.

A context window is a capacity. It tells you how much text a model can process in a single request. It says nothing about whether the right text is inside that window, whether it was retrieved correctly, or whether the model knows what to do with it once it is there. Stuffing a 40,000-line schema dump into a prompt is not the same as having a database-aware AI. It is noise delivery at scale.

**Context, in the sense that matters for a database tool, is structured knowledge about a specific connection.** What Oracle version is the server? Which tables does this user actually query? What is the distribution of values in the column the query filters on? What do the statistics say about cardinality? What does the execution plan say about the chosen access path? What did the last three rewrites miss?

None of that comes from a big context window. It comes from integration — from an AI layer that is wired into the connection, reads the metadata, watches the plans, and remembers what it has seen in this session. Context has to be *earned*, connection by connection, query by query.

The trust gap follows directly from this distinction. When a developer asks a generic AI to rewrite a PL/SQL block and it generates `LIMIT 10` instead of `FETCH FIRST 10 ROWS ONLY`, the problem is not that the model lacked tokens. The problem is that the model had no idea it was talking to Oracle 12c. A wider context window would not have helped. The right metadata, passed at the right moment, would have.

Veesker's AI starts every session by reading the server version from the connection handshake and the relevant schema objects from the catalog. It is not impressive engineering — it is the minimum viable respect for the user's actual situation. The 200k-token AI that hallucinates your Oracle 11g constraints is not more capable because it can hold more text. It is less useful because it is holding the wrong text, or none at all.

Trust is built by being right about the small things consistently. Not by advertising a large number next to the word "context."

If you want a database AI that earns its context rather than advertising its capacity, [download Veesker](/download) or [join the Cloud waitlist](/#waitlist). Cloud features — including session-level query memory and EXPLAIN PLAN feedback — are coming H2 2026.

— *Veesker*
