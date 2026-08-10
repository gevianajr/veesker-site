---
title: "CDB e PDB na prática: como o Veesker navega hierarquias de bancos de dados plugáveis"
description: "A arquitetura Multitenant do Oracle divide os bancos em containers e plugáveis. Veja como trabalhar com isso no dia a dia e como o Veesker mantém a hierarquia visível."
date: "2026-08-10"
slug: "cdb-e-pdb-na-pratica"
lang: "pt"
kind: "deep-dive"
tags: ["oracle", "multitenant", "cdb", "pdb", "ferramentas-de-desenvolvimento"]
translation_slug: "cdb-and-pdb-in-practice"
read_minutes: 6
author: "claude-agent"
hero: "/datamap-hero.png"
---

A arquitetura Multitenant do Oracle existe em produção desde o 12c, mas boa parte dos desenvolvedores trata CDBs como um assunto exclusivo de DBA e deixa o tema de lado. Isso é compreensível: quando a IDE esconde a camada de container, você nunca a vê. Mas no momento em que algo dá errado — uma consulta não retorna linhas que deveriam existir, um usuário recém-criado não consegue se autenticar, uma view do dicionário mostra dados incompletos — a separação entre CDB e PDB é quase sempre a causa silenciosa.

Este é um guia prático para desenvolvedores que trabalham com Oracle 12c ou posterior: o que essa arquitetura realmente é, como ela altera o trabalho diário de consultas e como o Veesker expõe a hierarquia de containers para que você não precise mantê-la na memória.

## O que CDB e PDB realmente significam

O Oracle introduziu a arquitetura Multitenant no 12c para permitir que múltiplos bancos de dados "plugáveis" compartilhem uma única instância Oracle, permanecendo independentes e gerenciáveis separadamente. O nível superior é o Container Database (CDB). Dentro dele ficam um ou mais Pluggable Databases (PDBs).

Dois containers sempre existem por padrão:

- **CDB$ROOT** — a raiz da hierarquia. SYS e SYSTEM residem aqui. Os metadados do dicionário para todo o CDB ficam aqui.
- **PDB$SEED** — um modelo somente leitura. Ao criar um novo PDB, o Oracle o clona a partir do seed.

Os PDBs criados pelo usuário ficam ao lado do seed. Cada PDB se comporta como um banco Oracle tradicional do ponto de vista da aplicação: tablespaces próprios, usuários locais próprios, dicionário de dados próprio. A instância compartilhada é uma preocupação de infraestrutura, não da aplicação — até o momento em que você abre o dicionário a partir da raiz do CDB, de onde é possível enxergar todos os containers de uma vez.

## Conectando ao lugar certo

A pergunta mais prática é também a mais confusa: *a qual service name devo me conectar?*

Um CDB padrão expõe no mínimo dois serviços TNS: um para a raiz (geralmente o nome do banco CDB, por exemplo, `ORCL`) e um por PDB (nomeado conforme o PDB, por exemplo, `ORCLPDB1`). Na Oracle Cloud Infrastructure, a wallet configura isso automaticamente. Em instalações on-premises, os serviços podem ou não estar no `tnsnames.ora` — verifique com `lsnrctl status`.

```sql
-- Veja os PDBs da instância e seus modos de abertura
SELECT name, con_id, open_mode FROM v$pdbs;
```

Se você se conectar à raiz do CDB, estará em `CDB$ROOT`. Para mudar de container sem desconectar:

```sql
ALTER SESSION SET CONTAINER = ORCLPDB1;
```

Isso só funciona quando conectado como um usuário comum (mais sobre isso abaixo). Usuários de aplicação devem se conectar diretamente ao service name do PDB — `ALTER SESSION SET CONTAINER` é um padrão administrativo, não algo que um pool de conexões de aplicação deva fazer.

O Veesker lê a versão do servidor no momento da conexão e, para 12c em diante, exibe a árvore de containers no navegador de objetos: a raiz do CDB é o nó de topo, os PDBs ficam abaixo. Selecionar um PDB restringe o contexto da sessão a aquele container. O container ativo é sempre mostrado na aba de conexão, então você não precisa rodar `sys_context('USERENV', 'CON_NAME')` para lembrar onde está.

## Views do dicionário: CDB_ versus DBA_

A separação entre views do dicionário é onde a maior parte da confusão do dia a dia acontece. As clássicas `DBA_*` — `DBA_TABLES`, `DBA_SEGMENTS`, `DBA_OBJECTS` — mostram dados apenas do container atual. Em `CDB$ROOT`, você vê objetos do root. Dentro de um PDB, você vê os objetos daquele PDB.

As variantes `CDB_*` foram introduzidas no 12c e acrescentam uma coluna `CON_ID`:

```sql
-- Quantas tabelas em cada PDB?
SELECT con_id, COUNT(*) AS total_tabelas
FROM   cdb_tables
WHERE  owner NOT IN ('SYS', 'SYSTEM', 'OUTLN')
GROUP  BY con_id
ORDER  BY con_id;
```

Essa consulta só funciona quando conectado à raiz. Rodada dentro de um PDB, retorna apenas os dados daquele PDB, tornando a coluna `CON_ID` constante e sem utilidade naquele contexto.

Uma regra prática: se você está fazendo trabalho de aplicação, conecte-se ao PDB e use as views `DBA_*` ou `USER_*` normalmente. Se está fazendo administração ou monitoramento entre containers, conecte-se à raiz e use as views `CDB_*`.

O navegador de esquemas do Veesker se ajusta de acordo. Conectado à raiz, a árvore de objetos exibe as categorias de views `DBA_*` e `CDB_*`. Conectado a um PDB, a categoria `CDB_*` é recolhida, pois não oferece dados entre containers naquele contexto.

## Usuários comuns e usuários locais

O Oracle 12c introduziu a distinção entre *usuários comuns* — definidos no nível do CDB, existindo em todos os containers — e *usuários locais* — definidos em um único PDB. A convenção de nomenclatura para usuários comuns criados pelo usuário é o prefixo `C##`, que o Oracle reserva para evitar colisões com nomes de usuários locais de PDB.

```sql
-- Criar um usuário comum (executado na raiz do CDB)
CREATE USER C##AGENTE_MONITORAMENTO IDENTIFIED BY <senha>
    CONTAINER = ALL;

-- Criar um usuário local (conecte-se ao PDB alvo primeiro)
CREATE USER USUARIO_APP IDENTIFIED BY <senha>;
```

A implicação prática: se você criar um usuário na raiz do CDB sem o prefixo `C##` e sem `CONTAINER = ALL`, esse usuário existe apenas na raiz. Tentar se conectar ao PDB com esse usuário falha — do ponto de vista do PDB, o usuário não existe.

Usuários de aplicação devem ser usuários locais dentro do PDB. Usuários comuns são para agentes de monitoramento, contas de backup e ferramentas administrativas que legitimamente precisam abranger todos os containers. Usar usuários comuns para aplicações é tecnicamente possível e operacionalmente errado: um comprometimento de credencial passa a abranger todos os PDBs da instância.

O Veesker expõe essa distinção na seção Usuários do navegador de objetos: usuários comuns exibem um badge `C##`, usuários locais não. Se você está conectado à raiz e tenta criar um usuário sem o prefixo pelo diálogo "Criar Usuário", o Veesker avisa que o usuário será local à raiz e pergunta se você pretendia criar um usuário comum ou deve se conectar a um PDB primeiro.

## Privilégios entre containers

Os privilégios também vêm em dois escopos. Um `GRANT` na raiz com `CONTAINER = ALL` aplica o privilégio em todos os containers. Sem essa cláusula — ou quando concedido de dentro de um PDB — o privilégio se aplica apenas ao container atual.

```sql
-- Conceder DBA a um usuário comum em todos os containers
GRANT DBA TO C##AGENTE_MONITORAMENTO CONTAINER = ALL;

-- Conceder SELECT em uma tabela específica apenas no PDB atual
GRANT SELECT ON SCHEMA1.PEDIDOS TO USUARIO_APP;
```

O ponto sutil: um usuário comum pode ter `DBA` na raiz mas nenhum privilégio em um PDB específico, a menos que o `GRANT` tenha sido feito com `CONTAINER = ALL` ou repetido dentro daquele PDB. O usuário existe em todo lugar; o privilégio não, a menos que você o tenha colocado explicitamente lá.

## Como o Veesker navega a hierarquia

O handshake de versão é o ponto de partida. Ao confirmar 12c ou posterior, a camada CDB/PDB é ativada em toda a interface:

**Navegador de objetos.** O nó raiz exibe o nome do CDB com dois ramos — CDB$ROOT e a lista de PDBs de `V$PDBS`. Selecionar um PDB define o container ativo para as consultas executadas no editor SQL. O cabeçalho da aba sempre mostra o nome do container atual.

**Contexto do editor SQL.** As consultas são executadas no contexto do container selecionado. Se você está navegando dentro de um PDB e muda para o editor, o assistente de IA sabe que está operando dentro daquele PDB, não na raiz. Ele não sugerirá views `CDB_*` a menos que você tenha mudado para a raiz, pois naquele contexto de PDB essas views retornam apenas dados locais.

**Avisos de usuário comum.** O diálogo "Criar Usuário" verifica se você está na raiz e se o nome proposto não tem o prefixo `C##`, exibindo o aviso adequado antes de você confirmar.

**Indicador de modo de abertura do PDB.** O campo `V$PDBS.OPEN_MODE` é lido quando a árvore é carregada. Um PDB em modo `MOUNTED` ou `READ ONLY` exibe um badge ao lado do nome. Tentar executar DML contra um PDB montado ou somente leitura vai falhar; saber antes de tentar evita o erro de ida e volta.

**Consultas entre containers.** Quando você executa uma consulta no contexto da raiz, o assistente de IA do Veesker reconhece referências a views `CDB_*` e pode sugerir um filtro por `CON_ID` caso você o tenha esquecido. Esse comportamento não é aplicado em contextos de PDB, onde ele difere.

---

A camada Multitenant é uma das áreas onde a evolução do Oracle criou complexidade real para desenvolvedores — não porque o design seja ruim, mas porque a maioria das ferramentas ou a esconde ou a ignora. Quando a sua IDE a expõe de forma clara, a complexidade deixa de ser um atrito invisível e passa a ser uma estrutura gerenciável sobre a qual você pode raciocinar.

Faça o download do Veesker e navegue pela hierarquia CDB/PDB de uma única árvore de conexões: [veesker.cloud/download](/download).

— *Veesker*
