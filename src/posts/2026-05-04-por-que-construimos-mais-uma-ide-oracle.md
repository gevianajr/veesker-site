---
title: "Por que construímos mais uma IDE Oracle em 2026"
description: "A caixa de ferramentas do dev Oracle está cheia — SQL Developer, PL/SQL Developer, DBeaver, Toad. Então por que mais uma? Porque nenhuma trata 9i até 26ai como um único trabalho, e nenhuma traz IA que entende PL/SQL."
date: "2026-05-04"
slug: "por-que-construimos-mais-uma-ide-oracle"
lang: "pt"
kind: "deep-dive"
tags: ["oracle", "ferramentas-dev", "posicionamento", "ia"]
translation_slug: "why-we-built-another-oracle-ide"
author: "claude-agent"
read_minutes: 7
hero: "/blog/por-que-construimos-mais-uma-ide-oracle.png"
---

A caixa de ferramentas do dev Oracle em 2026 é igualzinha à de 2014: SQL Developer (ainda em Java, ainda brigando com tela Retina), PL/SQL Developer (fechado, só Windows, pago), Toad (pesado, com gosto de vendor), DBeaver (genérico, Oracle é um de cinquenta dialetos). Cada um resolve *parte* do trabalho. Nenhum resolve o trabalho de verdade, que é: **"eu vivo de Oracle, e quero uma ferramenta que respeite isso."**

Veesker existe porque esse vão é estrutural, não estético. Três coisas precisaram mudar ao mesmo tempo pra fazer sentido construir.

## 1. A faixa 9i-a-26ai não é nicho — é o trabalho

A situação Oracle mais comum em empresas reais é o **parque misto**. Um varejista rodando EBS em 11g pro financeiro, 19c pro warehouse e um piloto 23ai pra busca vetorial. Um banco com 12c na mesa de trade e 21c no DW analítico. Uma logística no 10g porque a migração estourou orçamento em 2018 e nunca voltou.

Se sua IDE quebra silenciosamente em conexão 11g, ou te obriga a instalar driver separado por versão, ou recusa 9i porque "está deprecated" — você não está resolvendo o problema do dev. Está empurrando ele de volta.

Veesker já vem com o Oracle Instant Client e detecta o modo Thick correto automaticamente. Um binário, todas as versões que a Oracle ainda dá patch de kernel. **O legado não é nota de rodapé. O legado é o cliente.**

## 2. PL/SQL não é SQL genérico, e IA genérica sabe disso

Joga um LLM genérico numa janela de query e pede pra reescrever uma query Oracle. Olha o que acontece:

- Gera `LIMIT 10` em vez de `FETCH FIRST 10 ROWS ONLY`.
- "Conserta" seu `CONNECT BY PRIOR` virando CTE recursiva que roda 40× mais lento no otimizador da Oracle.
- Alucina sintaxe `MERGE` que não compila em 11g.
- Tira seus hints porque "estão deprecated" (não estão).
- Reescreve bind variables como concatenação de string porque é o que o corpus de treinamento mostra mais.

PL/SQL é um dialeto com centenas de decisões cravadas, e um LLM treinado na web aberta viu Oracle exatamente o suficiente pra ser perigoso. A solução não é modelo maior — é *grounding*. A IA da Veesker conhece seu schema (porque pode lê-lo localmente), conhece sua versão Oracle (porque a conexão informou), e conhece os hints que você quer preservar (porque entregamos um parser que entende, em vez de fingir que Oracle é Postgres).

A camada Cloud (chega no segundo semestre de 2026) vai além: alimenta saída de `EXPLAIN PLAN` de volta no modelo, então quando a IA sugere uma reescrita, o veredito é do otimizador baseado em custo — não de heurística.

## 3. Local-first não é nostalgia — é postura de segurança

Todo dev Oracle com quem trabalhei na última década já teve pelo menos uma destas conversas:

- "Não dá pra usar essa ferramenta porque ela manda dados pra fora."
- "Compliance não aprova porque a string de conexão passa por um SaaS."
- "Auditoria precisa de prova que ninguém fora do prédio acessa o dev."

A resposta da maioria das ferramentas "modernas" é lançar uma versão hospedada mesmo assim, pedir credencial no navegador, e colar um adesivo de TLS na landing page. Isso funciona pra todo mundo — *exceto* os clientes que pagam por trabalho Oracle sério.

O default da Veesker é o oposto. A IDE roda totalmente offline. Credenciais ficam no keychain do OS — DPAPI no Windows, Keychain no macOS, Secret Service no Linux. Conexões nunca saem do desktop. Os recursos Cloud existem como *extensão opt-in*, não pré-condição.

Quando você liga o Cloud, a arquitetura honra a mesma postura: o VeeskerDB Sandbox criptografa os blobs ponta-a-ponta com X25519 + ChaCha20-Poly1305 *antes* deles tocarem nossos servidores. A Veesker é o relay. A gente nunca vê texto puro.

## Por que agora

Três coisas amadureceram juntas no fim de 2025 e tornaram esse produto economicamente viável de construir solo:

1. **Tauri 2** — mesma stack de UI do Slack/Discord, em 12 MB em vez de 200 MB. Performance nativa com ergonomia web.
2. **Vector tooling do Oracle 23ai** — a stack Oracle ganhou busca vetorial e API de modelos embutida nativamente. A superfície de IA deixou de ser bolt-on.
3. **Claude Code como colaborador real de engenharia** — não como brinquedo de autocomplete, mas como par que segura uma arquitetura na cabeça, escreve teste e revisa PR. Anos de design acumulado viraram semanas de entrega.

Esse último ponto é por que esse blog existe. A Veesker é construída majoritariamente com agente IA no loop, e este blog também: toda segunda um routine do Claude escreve um aprofundamento como esse, toda quinta um manifesto mais curto. O byline é honesto sobre isso. O gosto, as decisões, a linha editorial — são minhas. A vazão é do modelo. Esse arranjo deixa uma operação de uma pessoa publicar como time sem fingir que é.

## O que isso significa pra você

Se você escreve Oracle pra viver e sua ferramenta de escolha foi redesenhada pela última vez no governo Obama, **baixa a Veesker**. A Community Edition é grátis sob Apache 2.0, vai pra Windows / macOS / Linux, e suporta 9i até 26ai sem mexer em nada. Sem ginástica de marketplace, sem paywall por feature, sem telemetria.

Se você lidera time Oracle e está esperando uma camada gerenciada de IA que não dê dor de cabeça pro time de segurança — **[entra na waitlist do Cloud](/#waitlist)**. Preço de fundador travado em $29 USD por seat por mês, GA no segundo semestre de 2026, plano único com tudo dentro.

Não estamos aqui pra substituir seu DBA. Estamos aqui pra dar pro seu DBA uma ferramenta à altura do trabalho.

— *Veesker*
