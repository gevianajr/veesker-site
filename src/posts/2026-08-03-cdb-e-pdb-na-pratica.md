---
title: "CDB e PDB na prática: como o Veesker navega hierarquias de bancos de dados plugáveis"
description: "Um guia prático para a arquitetura multitenant do Oracle — CDB, PDB, service names, usuários comuns e como o Veesker expõe o contexto de container em cada camada."
date: "2026-08-03"
slug: "cdb-e-pdb-na-pratica"
lang: "pt"
kind: "deep-dive"
tags: ["oracle", "cdb", "pdb", "multitenant", "developer-tools"]
translation_slug: "cdb-and-pdb-in-practice"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

A arquitetura multitenant do Oracle — Container Databases e Pluggable Databases — foi lançada com o Oracle 12c em 2013. O modo não-CDB foi descontinuado no Oracle 21c. O Oracle 23ai e o 26ai são totalmente multitenant. Isso significa que qualquer pessoa que ainda trabalha com Oracle hoje está ou já em um CDB, ou num caminho de migração para um. No entanto, o multitenant continua sendo uma das partes mais mal compreendidas do ecossistema Oracle, e a maioria das ferramentas faz muito pouco para ajudar você a navegar por ele.

Este post cobre como o modelo CDB/PDB funciona na prática, onde os desenvolvedores se perdem, e como o Veesker expõe o contexto de container na camada de conexão, na árvore de objetos e na camada de IA.

## O que é um CDB, de fato

Um Container Database é a camada de virtualização do Oracle para instâncias de banco de dados. Ele possui os arquivos físicos: o control file, os redo logs, o tablespace de sistema. Dentro dele ficam um ou mais Pluggable Databases, cada um com seu próprio dicionário de dados, tablespaces e contas de usuário — isolados entre si como se fossem bancos de dados separados, mas compartilhando a memória e os processos em segundo plano do CDB pai.

Todo CDB tem dois containers especiais que sempre estão presentes.

**CDB$ROOT** é o container raiz. Ele armazena objetos comuns e usuários comuns. Quando você se conecta como SYSDBA sem especificar um service name que mapeia para um PDB específico, você cai aqui. Operações de DBA que abrangem todo o CDB — aplicação de patches, inicialização e encerramento de PDBs, criação de usuários comuns — acontecem a partir do CDB$ROOT.

**PDB$SEED** é o banco de dados semente que o Oracle utiliza quando você executa `CREATE PLUGGABLE DATABASE`. Você não pode fazer login diretamente no PDB$SEED para realizar alterações; ele é somente leitura por design.

Depois existem os PDBs de aplicação — os containers em que os times efetivamente trabalham. Cada um tem um service name, seu próprio tablespace `SYSTEM`, suas próprias contas de usuário e isolamento completo em relação a todos os outros PDBs no mesmo CDB.

## Service names: o que determina o container

O mecanismo que coloca você no container certo é o service name na string de conexão.

```
host:1521/ORCLPDB1
```

Esse componente após a barra é o service name. O Oracle o mapeia para o container correspondente no momento da conexão. Se a sua string aponta para `ORCLPDB1`, sua sessão abre naquele PDB. Se aponta para `ORCL` — que muitas vezes é o service name do CDB em uma instalação padrão — você cai no CDB$ROOT.

É aqui que boa parte da confusão começa. Um desenvolvedor tem uma conexão para `servidor:1521/ORCL` que funcionava bem antes de o DBA migrar para multitenant. Após a migração, o service name `ORCL` agora roteia para o CDB$ROOT, não para o schema da aplicação. As tabelas parecem ter sumido, os objetos não existem, e o desenvolvedor passa uma hora depurando uma conexão que está tecnicamente correta, mas apontando para o container errado.

O formato EZConnect torna o mapeamento explícito e legível. Aliases no `tnsnames.ora` podem obscurecê-lo se o campo `SERVICE_NAME` estiver desatualizado. O Veesker armazena a string EZConnect completa no perfil de conexão para que o container ao qual você se conecta esteja sempre visível sem precisar abrir um arquivo INI.

## Sessões em CDB$ROOT: o que muda na prática

Quando você está conectado ao CDB$ROOT com SYSDBA, várias coisas funcionam de forma diferente de uma sessão normal em um PDB de aplicação.

As views do dicionário de dados têm duas formas. Views prefixadas com `DBA_` mostram objetos com escopo no container atual. Views prefixadas com `CDB_` abrangem todos os PDBs abertos no CDB. `DBA_TABLES` no CDB$ROOT retorna tabelas visíveis a partir da raiz — em sua maioria objetos do sistema. `CDB_TABLES` retorna tabelas de todos os PDBs, com uma coluna `CON_ID` que identifica a qual container cada linha pertence.

```sql
-- Ver todas as tabelas ORDERS em todos os PDBs abertos
SELECT con_id, owner, table_name, num_rows
FROM   cdb_tables
WHERE  table_name = 'ORDERS'
ORDER  BY con_id;
```

Saber distinguir `DBA_` de `CDB_` é essencial para qualquer DBA que faça diagnósticos ou auditoria entre PDBs. Consultar `DBA_TABLES` no CDB$ROOT quando você esperava `CDB_TABLES` é uma falha silenciosa: o Oracle retorna um resultado, mas ele é o resultado errado para o que você estava perguntando.

Por padrão, DDL e DML têm escopo no container atual. Se você está no CDB$ROOT e executa `CREATE TABLE`, essa tabela vive no CDB$ROOT — quase nunca é o que você quer. Para trocar de container dentro de uma sessão, `ALTER SESSION SET CONTAINER = ORCLPDB1` funciona, desde que você tenha o privilégio `SET CONTAINER`. Isso é útil para scripts de DBA que precisam iterar entre PDBs sem abrir conexões separadas.

O Veesker torna o container atual sempre visível. Uma sessão em CDB$ROOT com privilégio SYSDBA recebe um badge de status distinto para que você não o confunda com uma sessão em PDB quando vários tabs estiverem abertos.

## Usuários comuns vs. usuários locais

O Oracle distingue entre usuários comuns e usuários locais com base em onde foram criados.

**Usuários locais** pertencem a um único PDB. São criados em uma sessão de PDB e não podem acessar o CDB$ROOT ou qualquer outro PDB. A grande maioria dos schemas de aplicação são usuários locais: `APP_OWNER`, `USUARIO_RELATORIO`, `PROC_ETL` — todos locais.

**Usuários comuns** são criados no CDB$ROOT e existem em todos os PDBs do CDB. Em instalações padrão do Oracle, seus nomes devem começar com `C##` para distingui-los de usuários locais. Usuários comuns podem receber privilégios em containers específicos ou em todos eles com a cláusula `CONTAINER=ALL`. Um usuário comum com privilégios de DBA e `CONTAINER=ALL` é o superusuário canônico em um ambiente multitenant.

O prefixo `C##` pega as pessoas de surpresa na primeira vez. Você executa `CREATE USER MONITORAMENTO IDENTIFIED BY ...` no CDB$ROOT e o Oracle levanta `ORA-65096: nome de usuário ou role comum inválido`. A solução é renomear o usuário para `C##MONITORAMENTO` se a intenção é um usuário comum, ou conectar-se ao PDB alvo primeiro para criar um usuário local com o nome original.

A IA do Veesker inclui a identidade do container atual no seu contexto de prompt. Quando você pede que ela gere um comando `CREATE USER`, ela produz a forma correta para onde você está — sintaxe de usuário local em uma sessão de PDB, sugestões de usuário comum com o aviso sobre `C##` no CDB$ROOT.

## A table function CONTAINERS()

Uma razão legítima para trabalhar a partir do CDB$ROOT é a table function `CONTAINERS()`, que permite consultar um objeto em todos os PDBs abertos em um único comando.

```sql
SELECT con_id, owner, segment_name, bytes / 1024 / 1024 AS mb
FROM   CONTAINERS(dba_segments)
WHERE  segment_name = 'ORDERS'
ORDER  BY con_id;
```

`CONTAINERS()` é útil para auditar se um objeto está consistente entre todos os PDBs de aplicação, agregar estatísticas de armazenamento entre tenants, ou verificar se um script de implantação foi executado corretamente em todos os lugares sem precisar trocar de container um a um. O `con_id` no resultado corresponde ao `CON_ID` em `V$PDBS`.

Isso não é um padrão para código de aplicação — conexões de aplicação sempre devem apontar para um PDB específico por meio de seu service name. Mas para diagnósticos de DBA e administração multitenant, `CONTAINERS()` elimina uma quantidade significativa de loops com `ALTER SESSION SET CONTAINER`.

## Como o Veesker expõe tudo isso

A maioria das ferramentas de IDE trata o multitenant como um detalhe marginal: árvore de objetos plana, sem indicador de container na aba, sem distinção entre views `DBA_` e `CDB_`, sem ciência de que um `CREATE USER` a partir do CDB$ROOT precisa de um formato de nome diferente.

O handshake pós-conexão do Veesker faz mais do que ler um número de versão. No Oracle 12c e versões posteriores, ele executa uma consulta adicional em `V$PDBS` para enumerar os PDBs abertos no CDB. A árvore de objetos então popula com um nó raiz CDB e nós filhos de PDB quando sua sessão está no CDB$ROOT. Se a sessão está diretamente dentro de um PDB, a árvore mostra o schema daquele PDB diretamente — a interface corresponde ao container em que você está, não a um superconjunto genérico do Oracle.

O controle de versão descrito no [post sobre thick mode](/blog/oracle-9i-to-26ai-thick-mode-auto-discovery) se aplica aqui também. No 11g e versões anteriores, não existe camada CDB, não existe `V$PDBS`, não existe prefixo `CDB_`, e o Veesker não exibe elementos de interface para coisas que o servidor conectado não possui.

O contexto de IA para qualquer sessão inclui a identidade do container, a versão do Oracle e — em uma sessão CDB$ROOT — a lista de PDBs. Quando você faz uma pergunta sobre schema, o modelo sabe se você está em um PDB de aplicação com escopo de usuário local ou no CDB$ROOT com visibilidade entre PDBs. Essa distinção muda o que é uma resposta correta, e o grounding da IA cuida disso sem que você precise incluir isso como prefácio em cada prompt.

## A conclusão prática

O multitenant não é uma complexidade que você pode adiar ficando em versões antigas do Oracle. O modo não-CDB foi removido a partir do 21c, e toda nova instalação de 23ai e 26ai é um CDB por definição. A disciplina de saber em qual container você está — e ter suas ferramentas tornando isso claro — não é opcional para ninguém que trabalhe com Oracle atual.

O service name na sua string de conexão determina o container. O prefixo `C##` distingue usuários comuns dos locais. As views `CDB_` abrangem containers; as views `DBA_` têm escopo no atual. `CONTAINERS()` é a saída de emergência para consultas entre PDBs a partir do CDB$ROOT. Esses não são casos de borda obscuros — são as mecânicas do dia a dia de qualquer instalação Oracle 12c ou posterior.

Se sua IDE atual mostra uma árvore de objetos plana sem indicação de container e sem distinção entre views `DBA_` e `CDB_`, [baixe o Veesker](/download) e conecte-se ao seu CDB. A diferença é visível na primeira sessão. O Veesker é local-first, funciona completamente offline e é distribuído como um único binário sob Apache 2.0 para Windows, macOS e Linux.

— *Veesker*
