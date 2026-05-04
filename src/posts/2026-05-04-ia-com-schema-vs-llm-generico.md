---
title: "IA com consciência de esquema: por que LLMs genéricos falham com PL/SQL"
description: "LLMs genéricos conhecem Oracle o suficiente para ser perigosos — reescritas erradas de CONNECT BY, sintaxe incorreta de MERGE, hints removidos e bind variables virados em concatenação."
date: "2026-05-04"
slug: "ia-com-schema-vs-llm-generico"
lang: "pt"
kind: "deep-dive"
tags: ["oracle", "plsql", "ia", "schema-aware", "developer-tools"]
translation_slug: "schema-aware-ai-vs-generic-llm"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

A experiência do desenvolvedor Oracle com IA genérica segue um arco familiar: você cola uma query, o modelo devolve algo que parece plausível à primeira vista, você executa, e o Oracle ou rejeita imediatamente ou aceita e produz resultados quatro vezes mais lentos do que o original. O modelo estava confiante. O modelo estava errado de formas que só aparecem quando você conhece o contexto completo — o esquema, a versão do Oracle, o estado do otimizador, a intenção por trás da query.

Essa discrepância tem um nome: **falta de aterramento**. E ela explica quase todos os modos de falha práticos quando você traz um LLM genérico para um fluxo de trabalho PL/SQL.

## O que "aterramento" significa neste contexto

Uma assistente de IA aterrada conhece o ambiente em que opera. Para um desenvolvedor Oracle, isso significa:

- O **esquema**: nomes reais de tabelas, tipos de colunas, restrições, chaves estrangeiras — não um palpite genérico.
- A **versão do servidor**: 11g, 19c, 23ai. As regras de sintaxe mudam. As funções disponíveis mudam. O comportamento do otimizador muda.
- A **intenção**: você está tentando minimizar CPU, reduzir o tempo de parse, lidar com um conjunto grande de linhas ou contornar um defeito conhecido do otimizador?

Um LLM genérico treinado na web pública viu muita SQL. Mas viu muito mais Postgres e MySQL do que Oracle, e dentro do Oracle viu muito mais respostas do Stack Overflow do que bases de código em produção. O que ele não viu foi *seu* esquema, *sua* versão, *sua* combinação específica de distribuição de dados e cobertura de índice. E são exatamente essas coisas que determinam se uma query funciona.

## CONNECT BY e a armadilha do CTE recursivo

A sintaxe de query hierárquica do Oracle é anterior ao CTE recursivo padrão SQL (`WITH ... AS (... UNION ALL ...)`). Ambas podem expressar travessia de árvore. Na prática, não são intercambiáveis.

Uma query típica com `CONNECT BY PRIOR` em uma lista de adjacência com dez milhões de linhas:

```sql
SELECT employee_id, manager_id, LEVEL,
       SYS_CONNECT_BY_PATH(last_name, '/') AS path
FROM   employees
START WITH manager_id IS NULL
CONNECT BY PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;
```

Peça a um LLM genérico para "modernizar" isso e você receberá um CTE recursivo. O CTE é semanticamente equivalente — com ressalvas — mas no otimizador baseado em custo do Oracle, o caminho `CONNECT BY` frequentemente acessa planos de execução internos especializados que o caminho CTE não consegue usar. A cláusula `ORDER SIBLINGS BY`, que ordena irmãos em cada nível da hierarquia sem colapsar a estrutura da árvore, não tem equivalente direto em um CTE. O modelo ou a remove silenciosamente ou produz algo que ordena diferente.

O modelo não está errado ao sugerir um CTE. Está errado ao sugeri-lo como uma "modernização" direta sem medir a diferença de plano no tamanho específico da tabela e na estrutura de índice. A recomendação correta exige conhecer a versão (o Oracle 11g lida com CTEs recursivos de forma menos eficiente do que o 19c) e executar `EXPLAIN PLAN` em ambas antes de confirmar a mudança.

## Sintaxe MERGE: específica por versão, fácil de quebrar

A instrução `MERGE` do Oracle é notoriamente sensível à versão. A forma base é estável desde o 9i, mas a cláusula `DELETE` no ramo `WHEN MATCHED`, a posição do predicado `WHERE` e o tratamento de valores `DEFAULT` em `WHEN NOT MATCHED` evoluíram entre as versões principais.

Um LLM genérico, ao ser solicitado a produzir um `MERGE` para fazer upsert de uma tabela de staging em uma tabela de produção no 11g, frequentemente gera:

```sql
-- NÃO faz parse no Oracle 11g
MERGE INTO target t
USING source s ON (t.id = s.id)
WHEN MATCHED THEN
  UPDATE SET t.val = s.val WHERE s.active = 1 DELETE WHERE t.obsolete = 1
WHEN NOT MATCHED BY TARGET THEN
  INSERT (t.id, t.val) VALUES (s.id, s.val);
```

O qualificador `BY TARGET` na cláusula `WHEN NOT MATCHED` vem da sintaxe `MERGE` do T-SQL. O Oracle não usa isso. O posicionamento inline do `DELETE` após o predicado `WHERE` do `UPDATE` também está errado para o 11g — a cláusula `DELETE` deve seguir a cláusula `UPDATE` completa em uma posição específica. No 19c, a estrutura permitida muda novamente.

Uma assistente ciente da versão se recusaria a gerar sintaxe Oracle `MERGE` sem confirmar primeiro a versão do banco alvo. Uma genérica vai gerar algo, com confiança, que falhará no momento do parse — ou pior, que fará parse e se comportará incorretamente porque a semântica não é o que parece.

## Hints do otimizador: os que você conquistou

A sintaxe de hints do Oracle é um recurso documentado de primeira classe. Hints como `/*+ INDEX(t MY_IDX) */`, `/*+ USE_NL(a b) */` ou `/*+ PARALLEL(8) */` não são deprecated nem sinal de má prática. São o mecanismo pelo qual um DBA se comunica diretamente com o otimizador baseado em custo quando o plano derivado por estatísticas é subótimo para uma distribuição de dados conhecida.

Um LLM genérico, ao ser solicitado a limpar ou reescrever uma query com hints, frequentemente os remove. O corpus de treinamento do modelo contém um volume significativo de conselhos sugerindo que hints são uma solução alternativa para gerenciamento deficiente de estatísticas, e ele generaliza isso para removê-los diretamente. Em uma query de warehouse onde os hints foram conquistados com semanas de tuning, essa remoção é destrutiva. A query sem o hint pode ser o dobro mais lenta ou pode escolher um full-table scan em uma tabela de 500 milhões de linhas.

Pior: quando o modelo preserva hints, frequentemente os posiciona de forma errada. `SELECT /*+ FULL(t) */ ...` funciona. `SELECT ... FROM t /*+ FULL(t) */` não funciona. O posicionamento de hints é rígido no Oracle, e o modelo frequentemente introduz erros sutis de posicionamento que fazem o Oracle ignorar silenciosamente o hint em vez de gerar um erro — o que significa que a query executa, o plano está errado, e nada indica o motivo.

## Bind variables: a regressão que parece uma simplificação

Bind variables existem por duas razões: segurança (prevenção de SQL injection) e eficiência de parse (um plano parseado é armazenado em cache contra o template de bind variable, não recomputado para cada valor literal). Qualquer aplicação Oracle com throughput de queries significativo depende da reutilização de bind variables para manter a sobrecarga de parse gerenciável.

Um LLM genérico, ao ser solicitado a simplificar ou traduzir um bloco PL/SQL, frequentemente reescreve referências de bind variables como concatenação de strings:

```sql
-- Original (correto)
EXECUTE IMMEDIATE
  'SELECT count(*) FROM orders WHERE status = :1'
  INTO v_count USING p_status;

-- Reescrito por um LLM genérico (errado)
EXECUTE IMMEDIATE
  'SELECT count(*) FROM orders WHERE status = ''' || p_status || ''''
  INTO v_count;
```

O modelo está fazendo correspondência de padrões a partir de dados de treinamento onde concatenação de strings é o idioma dominante. Em um ambiente Oracle OLTP, essa reescrita provoca tempestades de hard parse em caminhos de alto tráfego e abre vulnerabilidades de injeção quando `p_status` vem de entrada do usuário. O modelo não sabe que `p_status` é fornecido externamente. Não sabe que sua aplicação executa essa query mil vezes por segundo. Ele enxerga apenas o bloco de código local isoladamente.

## A arquitetura da IA com consciência de esquema

Corrigir esses modos de falha requer que a assistente conheça coisas que não estão no texto do prompt:

1. **O esquema** — recuperado ao vivo da instância Oracle conectada, não inferido da query.
2. **A versão** — lida do cabeçalho da conexão no momento da conexão, usada para definir a sintaxe disponível e a semântica dos hints.
3. **O plano** — executar `EXPLAIN PLAN` em candidatos a reescrita antes de apresentá-los, e comparar custos.
4. **Preservação de intenção** — reconhecer que um hint, uma bind variable ou uma cláusula `CONNECT BY` existe por uma razão específica antes de tocá-los.

A camada de IA local do Veesker implementa os dois primeiros hoje. Quando a janela de contexto de IA é preenchida para uma sessão, ela inclui as definições reais de tabela do esquema conectado — extraídas de `ALL_TABLES`, `ALL_COLUMNS`, `ALL_CONSTRAINTS` — e a string de versão do servidor detectada no momento da conexão. O modelo não consegue alucinar nomes de colunas que não existem, e sabe se `JSON_VALUE` ou `VECTOR_DISTANCE` está disponível na versão atual antes de sugerir qualquer um dos dois.

O terceiro e o quarto — feedback baseado em plano e rastreamento mais profundo de intenção — fazem parte da camada Cloud, planejada para o segundo semestre de 2026. O design é executar `EXPLAIN PLAN` de forma transparente em candidatos a reescrita e exibir o delta de custo na UI de sugestão, para que o desenvolvedor possa ver se a mudança proposta pela IA torna o plano mais barato ou mais caro antes de aceitá-la.

Até que isso chegue, o uso mais seguro de qualquer assistente de IA em um contexto PL/SQL é o mesmo uso que você faria de um colega experiente: revise a saída com cuidado, execute o plano e desconfie da confiança onde ela não é respaldada por medição. Uma assistente aterrada comete menos erros confiantes. Uma não aterrada é rápida e errada de formas difíceis de perceber — até a produção te contar.

---

Baixe a Community Edition e conecte seu esquema Oracle — a IA sabe com qual versão está falando: [veesker.cloud/download](/download).

— *Veesker*
