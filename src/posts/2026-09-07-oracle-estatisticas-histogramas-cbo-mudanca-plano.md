---
title: "Estatísticas e histogramas no Oracle: por que o CBO muda o plano quando você coleta stats"
description: "Uma análise precisa de como o otimizador baseado em custo do Oracle usa estatísticas e histogramas para estimar cardinalidade, e por que coletar — ou mal-coletar — stats altera todos os planos subsequentes."
date: "2026-09-07"
slug: "oracle-estatisticas-histogramas-cbo-mudanca-plano"
lang: "pt"
kind: "deep-dive"
tags: ["oracle", "cbo", "estatisticas", "histogramas", "performance"]
translation_slug: "oracle-statistics-histograms-cbo-plan-changes"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

Uma query roda em 200 ms todo dia durante seis meses. Então alguém coleta estatísticas durante a noite e na manhã seguinte ela leva 45 segundos. O SQL não mudou. Os dados não mudaram de forma significativa. O plano mudou — e mudou porque o otimizador agora acredita em algo diferente sobre a forma dos dados.

Entender o porquê exige entender o que o otimizador baseado em custo (CBO) do Oracle realmente faz com as estatísticas — não a história de alto nível ("stats frescos = bom plano"), mas a cadeia específica desde os números brutos até a seleção do plano. Quando essa cadeia se torna visível, o comportamento deixa de ser misterioso e passa a ser previsível.

## Quais estatísticas o CBO realmente lê

O Oracle mantém estatísticas em três níveis: tabela, coluna e índice. Cada um tem um papel diferente na seleção do plano.

**Estatísticas de tabela** fornecem ao otimizador a escala geral: quantas linhas existem (`NUM_ROWS`), quantos blocos a tabela ocupa (`BLOCKS`) e o comprimento médio das linhas (`AVG_ROW_LEN`). A contagem de blocos entra diretamente no modelo de custo de full table scan. Uma tabela com 100.000 blocos e um caminho de full scan custa aproximadamente 100.000 I/Os lógicos, que o otimizador escala contra a estimativa de `DB_FILE_MULTIBLOCK_READ_COUNT` para chegar a um custo relativo.

**Estatísticas de coluna** cobrem `NUM_DISTINCT` (contagem de valores distintos, ou NDV), `LOW_VALUE`, `HIGH_VALUE`, `NUM_NULLS` e `DENSITY`. O otimizador usa esses valores para estimar seletividade — a fração de linhas que um predicado retornará — e então multiplica pelo `NUM_ROWS` para obter uma estimativa de cardinalidade. Essa estimativa de cardinalidade é o número que determina a ordem de join, o método de join e a escolha de operação.

**Estatísticas de índice** cobrem `BLEVEL` (profundidade da B-tree), `LEAF_BLOCKS`, `DISTINCT_KEYS` e `CLUSTERING_FACTOR`. O fator de clustering mede o quanto as linhas da tabela estão ordenadas em relação à ordem do índice: um clustering factor baixo significa que a maioria dos range scans de índice pode ser satisfeita com poucos acessos a blocos da tabela; um clustering factor alto significa que cada entrada do índice potencialmente está em um bloco diferente, tornando um index scan mais caro que um full scan além de uma pequena fração de linhas.

Você pode ler o estado atual dos três níveis em `DBA_TAB_STATISTICS`, `DBA_TAB_COL_STATISTICS` e `DBA_IND_STATISTICS`.

## A cadeia de seletividade e por que o NDV é o pivô

Para uma coluna sem histograma, o otimizador assume distribuição uniforme. Um predicado `WHERE status = 'FECHADO'` em uma coluna com `NUM_DISTINCT = 5` recebe seletividade de `1 / NDV = 0,2`. Aplicado sobre 1.000.000 de linhas, isso resulta em 200.000 linhas estimadas — o que quase certamente empurrará o otimizador para um full scan ou um hash join no lado filho.

Se os dados reais têm `status = 'FECHADO'` em 95% das linhas e `status = 'ATIVO'` nos 5% restantes, a suposição uniforme está errada em uma direção para um filtro em `ATIVO` (estimado 200.000, real ~50.000) e na outra para `FECHADO` (estimado 200.000, real ~950.000). O método de join escolhido, a memória alocada para hash joins, a decisão de broadcast ou redistribuição em um plano paralelo — tudo segue da estimativa de cardinalidade.

Esse é o problema que os histogramas existem para resolver.

## Tipos de histograma e quando cada um se aplica

O Oracle 12c consolidou a criação de histogramas em `DBMS_STATS.GATHER_TABLE_STATS` com o parâmetro `METHOD_OPT`. O padrão `FOR ALL COLUMNS SIZE AUTO` deixa o Oracle decidir quais colunas recebem histogramas e quantos buckets usar. Entender o que ele decide e por quê não é opcional se você quer comportamento de plano previsível.

**Histogramas de frequência** são criados quando `NUM_DISTINCT` está em ou abaixo do número de buckets solicitados (até 2048). Cada valor distinto ganha seu próprio bucket com uma contagem exata de linhas. Para o exemplo com `status` com cinco valores distintos, o Oracle pode registrar exatamente: `ATIVO → 50.000 linhas`, `FECHADO → 950.000 linhas` e assim por diante. O otimizador então usa a contagem exata em vez de `NUM_ROWS / NDV`. A seletividade para `WHERE status = 'ATIVO'` torna-se `50.000 / 1.000.000 = 0,05`, e o plano reflete isso.

**Histogramas de top-frequência** foram introduzidos no 12c para o caso em que `NUM_DISTINCT` excede o limite de buckets, mas a distribuição é fortemente assimétrica em torno de um número gerenciável de valores populares. O Oracle registra os valores mais frequentes exatamente e agrupa a cauda em um único bucket "outros". A coluna `HISTOGRAM` em `DBA_TAB_COL_STATISTICS` mostrará `TOP-FREQUENCY`.

**Histogramas de altura balanceada** (legado, ainda gerados em algumas condições pré-12c) dividem o intervalo de valores em buckets de igual altura onde cada bucket contém aproximadamente o mesmo número de linhas. Os valores de endpoint marcam as fronteiras. Esses são menos precisos para dados assimétricos do que histogramas de frequência ou top-frequência e são menos comuns em releases atuais.

**Histogramas híbridos** são o padrão no 12c e posteriores quando `NUM_DISTINCT` excede o limite de buckets, mas o top-frequência não se aplica bem. Eles combinam uma estrutura de altura balanceada com frequências exatas para os valores populares que caem nos endpoints dos buckets. O efeito prático é melhores estimativas de seletividade para colunas de alta cardinalidade com assimetria do que a altura balanceada sozinha oferece.

O tipo que o Oracle seleciona fica armazenado em `DBA_TAB_COL_STATISTICS.HISTOGRAM`. Ao investigar uma mudança de plano, verificar se o tipo de histograma mudou entre duas execuções de coleta de stats é tão importante quanto verificar se `NUM_ROWS` mudou.

## Quando coletar stats muda um plano

Os gatilhos comuns para mudanças de plano após uma coleta de stats são:

**Mudanças de NDV.** Uma nova carga de ETL adiciona um valor anteriormente desconhecido a uma coluna que antes tinha 10 valores distintos. O NDV passa de 10 para 11. A seletividade de distribuição uniforme muda ligeiramente, mas mais importante: se a coluna estava no limite do histograma de frequência, o Oracle pode agora escolher um tipo de histograma diferente.

**Criação ou exclusão de histograma.** `METHOD_OPT => 'FOR ALL COLUMNS SIZE AUTO'` cria histogramas onde o Oracle detecta assimetria e os remove onde não detecta. Uma coluna que tinha um histograma de frequência na semana passada pode não ter um nesta semana se a assimetria medida pelo Oracle caiu abaixo do seu limiar interno. Uma query que dependia de o otimizador saber que `tipo = 'NULO'` é raro receberá subitamente a estimativa de distribuição uniforme e escolherá uma estratégia de join diferente.

**Mudanças no clustering factor.** Após uma grande operação de delete e reinsert de linhas, a ordenação física das linhas da tabela em relação a um índice pode mudar substancialmente. Um clustering factor que era 50.000 pode se tornar 800.000 após uma recarga em massa que não preservou a ordem de inserção. Índices que antes eram eficientes em custo para range scans tornam-se caros, e o otimizador muda para full scans.

**Estatísticas obsoletas em um lado de um join.** Se a tabela A tem stats atuais mostrando 10.000 linhas e a tabela B tem stats obsoletos ainda mostrando 100.000 linhas (quando na realidade tem 5.000 após um truncamento de partição), a ordem de join que o otimizador seleciona será o inverso do ótimo. A estimativa de linhas para o lado driving está errada, e toda operação downstream herda esse erro.

## Controlando a coleta de stats sem surpresas

O pacote `DBMS_STATS` oferece controle suficiente para prevenir a maioria das surpresas desagradáveis.

**Estatísticas pendentes** permitem coletar em uma área de staging e publicar explicitamente. `DBMS_STATS.SET_TABLE_PREFS(owner, table_name, 'PUBLISH', 'FALSE')` faz com que coletas subsequentes escrevam em `USER_TAB_PENDING_STATS` em vez do dicionário ativo. Você pode testar queries contra stats pendentes definindo `OPTIMIZER_USE_PENDING_STATISTICS = TRUE` no nível da sessão, confirmar que os planos são aceitáveis e então publicar com `DBMS_STATS.PUBLISH_PENDING_STATS`. Regredir um plano em um sistema de produção durante uma janela de negócios é evitável — esse é o mecanismo que evita isso.

**Bloquear estatísticas** (`DBMS_STATS.LOCK_TABLE_STATS`) impede que a coleta automática sobrescreva stats que você definiu ou verificou manualmente. Útil para pequenas tabelas de lookup onde você sabe que a distribuição é estável e a coleta automática substituiria boas stats por estimativas amostradas.

**Estatísticas incrementais para tabelas particionadas** evitam coletar a tabela inteira quando apenas algumas partições mudaram. Definir `INCREMENTAL => TRUE` e `PUBLISH => TRUE` nas preferências da tabela diz ao Oracle para derivar estatísticas globais a partir de estatísticas no nível de partição, coletando apenas em partições cuja coluna `STALE_STATS` é `YES`. Em grandes tabelas particionadas, essa é a diferença entre uma coleta global de 30 minutos e uma incremental de 2 minutos.

**Controle de no-invalidate.** O parâmetro `NO_INVALIDATE` em `GATHER_TABLE_STATS` controla se os cursores existentes no shared pool são imediatamente invalidados ou podem expirar gradualmente. Definir `NO_INVALIDATE => DBMS_STATS.AUTO_INVALIDATE` (o padrão) deixa o Oracle escalonar a invalidação de cursores para prevenir uma avalanche. Para uma coleta de stats que você quer que entre em vigor imediatamente, `NO_INVALIDATE => FALSE` a força; para uma que você quer avaliar antes que afete cargas de trabalho em execução, `NO_INVALIDATE => TRUE` a adia.

## Lendo a cadeia em um sistema ao vivo

Quando um plano muda após uma coleta de stats, o caminho de investigação é:

1. Extraia as stats anteriores e atuais de `DBA_TAB_STATISTICS` e `DBA_TAB_COL_STATISTICS` usando `LAST_ANALYZED`. A view `DBA_TAB_STATS_HISTORY` mantém um registro com timestamp das coletas anteriores, e `DBMS_STATS.RESTORE_TABLE_STATS` pode restaurar para um timestamp específico para testes.

2. Verifique `HISTOGRAM` e `NUM_BUCKETS` para as colunas na lista de predicados. Se o tipo de histograma mudou, essa é quase sempre a causa.

3. Use `EXPLAIN PLAN` ou `DBMS_XPLAN.DISPLAY_CURSOR` para comparar `E-Rows` (estimado) contra `A-Rows` (real das estatísticas de execução reais). Uma grande divergência em uma operação específica identifica exatamente onde o modelo do otimizador divergiu da realidade.

4. Se as stats originais estavam de fato produzindo o plano correto, restaure-as com `DBMS_STATS.RESTORE_TABLE_STATS` e bloqueie-as enquanto você investiga a metodologia de coleta.

O modelo do CBO nunca é mais preciso do que as estatísticas que ele lê. Acertar esse modelo não é uma tarefa única; é uma disciplina operacional que merece a mesma atenção de monitoramento que espaço em disco e throughput de redo log.

---

O Veesker exibe a saída do EXPLAIN PLAN por conexão diretamente no editor, com `E-Rows` vs. `A-Rows` lado a lado na árvore do plano. [Baixe a Community Edition](/download) para ver isso no seu próprio Oracle.

— *Veesker*
