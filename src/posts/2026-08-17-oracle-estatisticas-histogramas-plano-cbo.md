---
title: "Estatísticas e histogramas no Oracle: por que o plano muda quando você coleta estatísticas"
description: "Uma análise técnica de como o Otimizador Baseado em Custo do Oracle usa estatísticas de tabela e histogramas de coluna para escolher planos de execução — e por que coletar estatísticas muda o plano."
date: "2026-08-17"
slug: "oracle-estatisticas-histogramas-plano-cbo"
lang: "pt"
kind: "deep-dive"
tags: ["oracle", "cbo", "statistics", "histograms", "query-tuning"]
translation_slug: "oracle-statistics-histograms-cbo-plan"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

O Otimizador Baseado em Custo do Oracle (CBO, na sigla em inglês) é o planejador de execução padrão desde o Oracle 7. Toda consulta que você executa passa por ele. Ele lê o SQL, modela os possíveis planos de execução, atribui um custo a cada um e escolhe o mais barato. A palavra "mais barato" é mensurável aqui: é uma fórmula que envolve contagens estimadas de linhas, I/O físico e ciclos de CPU.

A palavra mais importante nessa frase é **estimadas**. O CBO não executa a consulta para ver quantas linhas ela retornará. Ele estima, com base nas estatísticas que coletou sobre suas tabelas, colunas e índices. Essas estatísticas são a entrada para as decisões do otimizador. Quando as estatísticas são precisas, o otimizador toma boas decisões. Quando estão desatualizadas, ausentes ou simplesmente não capturam a forma dos seus dados, o otimizador toma decisões que parecem razoáveis no papel e são catastroficamente erradas na prática.

Este post explica a natureza desse problema, por que os histogramas são a parte mais importante do quadro de estatísticas, e o que acontece — inclusive a mudança de plano — quando você chama `DBMS_STATS.GATHER_TABLE_STATS`.

## O que o otimizador realmente lê

O Oracle armazena as estatísticas do otimizador no dicionário de dados. As principais views são `DBA_TABLES`, `DBA_TAB_COLUMNS`, `DBA_INDEXES` e seus equivalentes `ALL_` e `USER_`. Os números mais importantes para uma tabela são:

- **NUM_ROWS** — contagem estimada total de linhas
- **BLOCKS** — número de blocos de dados que a tabela ocupa
- **AVG_ROW_LEN** — comprimento médio de linha em bytes
- **LAST_ANALYZED** — timestamp da última coleta de estatísticas

Para cada coluna, o otimizador rastreia:

- **NUM_DISTINCT** — número de valores distintos
- **LOW_VALUE / HIGH_VALUE** — valores mínimo e máximo, armazenados em formato raw
- **NUM_NULLS** — contagem de valores nulos
- **DENSITY** — uma estimativa de seletividade para predicados de valor único (simplificando: 1/NUM_DISTINCT para dados uniformes)
- **HISTOGRAM** — uma estrutura de buckets que descreve a distribuição real dos dados, se foi construída

Sem um histograma, o otimizador assume que os dados estão distribuídos uniformemente ao longo do intervalo de valores da coluna. Para muitas colunas, essa suposição se sustenta. Para muitas outras, está completamente errada.

## Histogramas: o que são e quando importam

Um histograma é uma representação comprimida da distribuição de valores de uma coluna. O Oracle suporta vários tipos:

- **Histograma FREQUENCY** — um bucket por valor distinto; usado quando NUM_DISTINCT é pequeno o suficiente para caber dentro do limite de buckets
- **Histograma HEIGHT-BALANCED** — um tipo legado de versões anteriores; cada bucket contém aproximadamente o mesmo número de linhas
- **Histograma HYBRID** — introduzido no 12c; combina buckets de frequência para valores populares com buckets de altura igual para o restante do intervalo
- **Histograma TOP-FREQUENCY** — também do 12c; captura os N valores mais comuns quando NUM_DISTINCT excede o limite de buckets

A diferença entre "histograma presente" e "histograma ausente" importa mais quando a coluna tem **assimetria nos dados**: um pequeno número de valores aparece com muito mais frequência do que os demais.

Considere uma tabela `ORDERS` com uma coluna `STATUS` contendo seis valores distintos: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED`. Suponha que 98% das linhas sejam `DELIVERED` ou `CANCELLED`, e apenas 2% estejam nos outros quatro status.

Sem um histograma, o otimizador assume que cada status representa 1/6 das linhas (cerca de 16,7% de seletividade). Uma consulta com `WHERE STATUS = 'PENDING'` é estimada em 16,7% da tabela. O otimizador trata isso como uma fração significativa e pode optar por um full table scan.

Com um histograma, o otimizador sabe que `PENDING` representa 0,3% das linhas. A estimativa de seletividade cai drasticamente. O otimizador considera uma varredura de índice viável — e quase certamente a usa.

O caso inverso importa igualmente. Uma consulta com `WHERE STATUS = 'DELIVERED'` sem histograma também recebe a estimativa de 16,7%. Com um histograma, o otimizador sabe que tocará 60% da tabela e planeja um full scan. Essa é a escolha correta.

Histogramas não influenciam apenas um passo. Uma estimativa errada de linhas em um nó se propaga por toda a árvore do plano: concessões de memória erradas para hash joins, memória de ordenação errada, seleção incorreta do grau de paralelismo, e pruning de partição incorreto. O dano em cascata de uma única estimativa ruim em um nó de filtro pode afetar todas as junções e agregações acima dele.

## O que coletar estatísticas realmente muda

Quando você chama `DBMS_STATS.GATHER_TABLE_STATS`, o Oracle faz o seguinte:

1. Examina uma amostra dos dados da tabela (por padrão usando `AUTO_SAMPLE_SIZE`, que o Oracle calcula para equilibrar precisão e velocidade)
2. Computa contagens no nível da tabela: `NUM_ROWS`, `BLOCKS`, `AVG_ROW_LEN`
3. Computa estatísticas por coluna: `NUM_DISTINCT`, `LOW_VALUE`, `HIGH_VALUE`, `NUM_NULLS`, `DENSITY`
4. Decide se deve construir um histograma para cada coluna com base no parâmetro `METHOD_OPT` (padrão: `FOR ALL COLUMNS SIZE AUTO`)
5. Grava tudo isso no dicionário de dados
6. Opcionalmente invalida planos de execução em cache que dependem da tabela afetada

O plano muda quando as novas estatísticas revelam uma forma de dados diferente da que o otimizador assumia anteriormente.

O cenário mais comum: as estatísticas foram coletadas anos atrás. Os dados cresceram e ficaram assimétricos significativamente desde então. O otimizador vinha executando planos baseados em estimativas desatualizadas há meses. Quando você coleta estatísticas novas, o otimizador vê `NUM_ROWS` atualizado de 1 milhão para 40 milhões, e histogramas que revelam 80% das linhas concentradas em três valores de status. O plano que rodava em 200ms com as estatísticas antigas pode cair para 50ms com estatísticas precisas — ou o contrário, se o plano antigo era acidentalmente bom e as novas estatísticas revelam problemas estruturais na consulta.

## A interface do DBMS_STATS na prática

Uma coleta básica de estatísticas de tabela:

```sql
BEGIN
  DBMS_STATS.GATHER_TABLE_STATS(
    ownname          => 'HR',
    tabname          => 'EMPLOYEES',
    estimate_percent => DBMS_STATS.AUTO_SAMPLE_SIZE,
    method_opt       => 'FOR ALL COLUMNS SIZE AUTO',
    cascade          => TRUE   -- também coleta estatísticas de índice
  );
END;
/
```

Para inspecionar quais histogramas foram construídos:

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

A coluna `histogram` retorna `NONE`, `FREQUENCY`, `HEIGHT BALANCED`, `HYBRID` ou `TOP-FREQUENCY`. Um valor `NONE` em uma coluna usada em um predicado seletivo vale ser investigado.

Para observar a mudança de plano diretamente, use `EXPLAIN PLAN` antes e depois da coleta:

```sql
EXPLAIN PLAN FOR
  SELECT * FROM hr.employees WHERE department_id = 50;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

A coluna `E-Rows` na saída do plano é a estimativa de contagem de linhas do otimizador em cada passo. Execute isso antes de coletar estatísticas, colete, depois execute novamente. A diferença em `E-Rows` é exatamente o que a mudança de estatísticas produziu. Se as contagens reais de linhas (de `GATHER_PLAN_STATISTICS` ou `V$SQL_PLAN_STATISTICS_ALL`) divergirem significativamente das estimativas, você tem um problema de qualidade de estatísticas.

## Onde ficam as estatísticas desatualizadas

Os casos mais comuns em que estatísticas desatualizadas causam danos reais nos planos de execução:

**Cargas em massa.** Um job ETL insere 10 milhões de linhas durante a noite. Estatísticas desatualizadas fazem o otimizador planejar com a contagem de linhas da noite anterior. Os relatórios da manhã seguinte rodam com planos construídos para uma fração dos dados reais.

**Operações de purga.** Uma exclusão remove 80% das linhas de uma tabela. O otimizador continua planejando como se essas linhas existissem. Varreduras de intervalo de índice que agora deveriam ser full scans ainda são emitidas como full table scans.

**Truncamento de partição.** As estatísticas em nível de partição não são atualizadas automaticamente quando você trunca uma partição. As estatísticas globais da tabela ainda podem refletir a contagem antiga da partição.

**Novos objetos de esquema.** Uma tabela ou índice novo começa sem nenhuma estatística. O Oracle recorre a padrões: 0 linhas, 8 blocos, densidade estimada. Os planos para tabelas recém-criadas são quase sempre errados até a primeira coleta explícita.

A amostragem dinâmica (`OPTIMIZER_DYNAMIC_SAMPLING`) mitiga alguns desses casos amostrando dados no momento do parse, mas adiciona overhead por parse e não substitui a manutenção de estatísticas em tabelas movimentadas.

## Bloqueando estatísticas para evitar surpresas

Quando você tem um plano conhecido e bom vinculado a um estado específico de estatísticas, pode bloqueá-las com `DBMS_STATS.LOCK_TABLE_STATS`. Isso impede que jobs automáticos de manutenção de estatísticas alterem a entrada do otimizador para aquela tabela.

O bloqueio é útil quando:
- Você definiu manualmente estatísticas para corresponder a uma distribuição de dados específica (usando `DBMS_STATS.SET_COLUMN_STATS`)
- Você precisa de estabilidade de plano durante uma janela de release em que os volumes de dados estão mudando
- A amostra automática não consegue construir um histograma significativo dentro da janela de manutenção disponível

Bloquear estatísticas após uma coleta deliberada é uma ferramenta válida de estabilidade. Bloquear em vez de coletar — para evitar mudanças de plano — é uma forma de esconder o problema real em vez de resolvê-lo.

## Visibilidade de estatísticas no Veesker

O browser de esquema do Veesker exibe `LAST_ANALYZED` diretamente no painel de metadados da tabela. Quando você seleciona uma tabela na árvore de objetos, vê a idade das estatísticas sem precisar escrever uma consulta para `DBA_TAB_STATISTICS`. A camada de IA do Veesker considera a presença de histogramas em suas sugestões de ajuste: quando uma coluna usada em um predicado de filtro mostra `histogram = NONE` em `DBA_TAB_COL_STATISTICS`, a sugestão inclui uma chamada direcionada ao `DBMS_STATS` como pré-requisito, em vez de assumir que as estatísticas são adequadas.

O Veesker Community Edition é gratuito sob a Apache 2.0, e funciona em toda a faixa de versões Oracle do 9i ao 26ai. A camada Cloud — disponível no segundo semestre de 2026, com preço fundador de $29 USD por assento por mês para membros da lista de espera — adiciona interpretação assistida por IA de `EXPLAIN PLAN` e monitoramento de saúde de estatísticas em instâncias conectadas.

Se você está depurando uma regressão de plano após uma coleta de estatísticas, ou trabalhando com um esquema onde `LAST_ANALYZED` mostra 2019, [baixe o Veesker](/download) e traga as entradas do otimizador para a sua visão.

— *Veesker*
