---
title: "CDB e PDB na prática: como o Veesker navega em hierarquias de bancos de dados plugáveis"
description: "A arquitetura multi-tenant do Oracle transforma um único servidor em dezenas de bancos isolados — veja como o Veesker exibe essa hierarquia sem sobrecarregar cada sessão."
date: "2026-07-27"
slug: "cdb-e-pdb-na-pratica"
lang: "pt"
kind: "deep-dive"
tags: ["oracle", "cdb", "pdb", "multitenant", "arquitetura"]
translation_slug: "cdb-and-pdb-in-practice"
read_minutes: 7
author: "claude-agent"
hero: "/datamap-hero.png"
---

A arquitetura de Container Database multi-tenant do Oracle chegou no 12c e se tornou o padrão para novas instalações a partir do 21c. No 23ai, criar um banco não-CDB é algo que a Oracle desencoraja explicitamente. Se você estiver conectando a qualquer instância Oracle implantada nos últimos cinco anos, há uma chance real de ser um CDB — e, saiba ou não, isso muda o que você está conectado.

Este post cobre como a hierarquia CDB/PDB funciona na prática, o que isso significa para o trabalho diário de consulta e administração, e como o Veesker mapeia a arquitetura na interface de conexão sem transformá-la em um peso em cada sessão.

## O que é um CDB de fato

O Container Database é uma única instância Oracle — um conjunto de processos em segundo plano, um SGA, um conjunto de redo logs — que hospeda um ou mais Pluggable Databases. O CDB tem seu próprio container raiz, chamado `CDB$ROOT`, que detém o catálogo de metadados do Oracle, o dicionário de dados e as contas de usuário comuns que abrangem todos os containers. Cada PDB dentro desse CDB é um banco de dados isolado e autossuficiente, com seus próprios tablespaces, usuários locais, objetos locais e serviço de rede próprio.

A palavra-chave é *isolado*. Um PDB parece um banco Oracle comum pré-12c do ponto de vista da aplicação. Um formulário APEX, uma string de conexão JDBC legada, um sistema ERP — nenhum deles precisa saber que estão dentro de um CDB. Eles conectam a um nome de serviço de PDB, obtêm uma sessão com escopo inteiramente naquele PDB, e o restante do CDB permanece invisível.

O isolamento não é apenas lógico. Os arquivos de tablespace são separados. Objetos de schema em um PDB não podem referenciar objetos em outro sem um database link explícito. Um `DROP TABLE` no PDB-A não afeta o PDB-B.

Onde a arquitetura se torna diretamente relevante é quando você trabalha *pela* hierarquia — inspecionando todos os PDBs a partir da raiz, comparando contagens de objetos, administrando containers, verificando eventos de espera em nível de container, ou escrevendo consultas que precisam das views com prefixo `CDB_`.

## Conectando: raiz do CDB vs serviço do PDB

O Oracle expõe tanto a raiz do CDB quanto cada PDB individual como um serviço de rede. Como você se conecta determina o container inicial e o que você pode ver.

Conectar ao serviço da raiz do CDB abre uma sessão no `CDB$ROOT`. Você pode consultar `V$PDBS` para ver todos os bancos de dados plugáveis e seus status e, se você tiver o privilégio `SET CONTAINER`, alternar sua sessão para qualquer PDB com uma única instrução:

```sql
ALTER SESSION SET CONTAINER = MEUPDB;
```

Após isso, sua sessão se comporta exatamente como se você tivesse conectado diretamente ao MEUPDB. Sem reconexão, sem novas credenciais — apenas uma troca de contexto. Esta é a abordagem correta para tarefas administrativas em que uma conexão precisa percorrer vários containers.

Conectar diretamente a um nome de serviço de PDB fornece uma sessão com escopo naquele PDB, sem visibilidade dos PDBs irmãos. Este é o modo correto para conexões de aplicação e para desenvolvedores que trabalham no schema de um banco específico. Mais simples, mais contido, e adequado para quem não precisa saber que o CDB existe.

## A taxonomia de views: CDB_, DBA_, V$

Antes do 12c, as views `DBA_*` eram o catálogo autoritativo. Em um ambiente CDB, essas views ainda existem, mas seu escopo é o *container atual*. Conectado a um PDB e consultando `DBA_TABLES`? Você vê tabelas daquele PDB. Conectado ao `CDB$ROOT` e consultando `DBA_TABLES`? Você vê apenas tabelas da raiz.

O Oracle adicionou a família de views `CDB_*` para dar visibilidade entre containers. `CDB_TABLES` é `DBA_TABLES` com uma coluna `CON_ID` identificando a qual container cada linha pertence. A consulta a seguir, executada de uma sessão na raiz do CDB, mostra a contagem total de objetos de desenvolvedor por banco de dados plugável:

```sql
SELECT
    p.name,
    COUNT(o.object_name) AS object_count
FROM
    cdb_objects o
    JOIN v$pdbs p ON o.con_id = p.con_id
WHERE
    o.oracle_maintained = 'N'
GROUP BY
    p.name
ORDER BY
    object_count DESC;
```

Isso exige uma sessão na raiz com `SELECT ANY DICTIONARY` ou um privilégio equivalente de usuário comum. Não funciona a partir de uma sessão de PDB — uma fonte comum de `ORA-02030: can only select from fixed tables/views` quando alguém tenta executar um script de administração entre containers a partir de uma conexão de aplicação.

## O que o Veesker faz com isso

Toda conexão do Veesker realiza um handshake de versão imediatamente após o estabelecimento da sessão OCI. No 12c e versões posteriores, o Veesker emite uma consulta adicional para determinar se a instância é um CDB e em qual container a sessão está:

```sql
SELECT cdb, con_id, con_name FROM v$database
```

Se `CDB = 'YES'`, a instância é multi-tenant. `CON_ID = 1` significa que a sessão está no `CDB$ROOT`. `CON_ID > 1` indica que a sessão aterrou em um PDB.

A árvore de objetos reflete isso. Uma conexão ao `CDB$ROOT` exibe o nó CDB no nível superior, com os PDBs filhos listados abaixo. Cada PDB na árvore pode ser expandido para inspecionar seus schemas sem trocar de container — o Veesker emite consultas entre containers usando a família de views `CDB_` nos bastidores, mas exibe os resultados por PDB para corresponder à forma como você pensa na hierarquia.

Para conexões de desenvolvedor que aterram em um PDB, a árvore é plana: sem a sobrecarga do CDB, sem ruído de container. O desenvolvedor vê exatamente o que o PDB contém.

O contexto SQL carrega o mesmo nível de consciência. Se você está em uma sessão de raiz do CDB, o nome do container e a versão fazem parte do que o Veesker passa para a camada de IA. Uma consulta referenciando `CDB_SEGMENTS` receberá uma sugestão para filtrar por `CON_ID`. Uma consulta contra `DBA_TABLES` em uma sessão de raiz apontará o escopo e sugerirá se você prefere o equivalente `CDB_`.

## Troca de container na interface

Para conexões ao `CDB$ROOT`, o Veesker disponibiliza um seletor de container na barra de ferramentas da sessão. Selecionar um PDB emite `ALTER SESSION SET CONTAINER`, atualiza o breadcrumb no topo da sessão e atualiza a árvore de objetos para exibir o container de destino. O histórico de consultas permanece na aba; apenas o contexto do container muda.

Isso não substitui os perfis de conexão por PDB salvos — para trabalho persistente em um PDB específico, uma conexão dedicada ainda é a resposta mais limpa. Mas para um DBA que precisa inspecionar três PDBs em sequência, a troca de container evita abrir três painéis de conexão separados.

## Armadilhas comuns

**Usuários comuns vs usuários locais.** Usuários comuns (com prefixo `C##` no 12c ao 21c — o requisito é flexibilizado no 23ai) existem no `CDB$ROOT` e se propagam a todos os PDBs. Usuários locais existem apenas no PDB onde foram criados. Se você precisar de uma conta de DBA que possa trocar de container, ela deve ser um usuário comum criado a partir da raiz. Criar um usuário em uma sessão de PDB produz um usuário local — silenciosamente — que depois não consegue executar `ALTER SESSION SET CONTAINER`. O Veesker rotula os usuários na árvore de objetos como comuns ou locais para tornar isso visível antes de você construir sobre uma suposição errada.

**Modo de abertura do PDB.** PDBs podem estar em `READ WRITE`, `READ ONLY` ou `MOUNTED`. Um PDB no modo `MOUNTED` rejeita conexões com `ORA-01033`, que parece um erro de inicialização genérico em vez de um problema de estado do container. O Veesker verifica `V$PDBS` em conexões de raiz do CDB e marca PDBs que não estão em modo `READ WRITE` com um indicador de status na árvore, antes que você tente se conectar a eles.

**Nomes de serviço.** No formato EZConnect, `host:porta/nome_servico` conecta ao que o listener anuncia para aquele nome. A maioria dos ambientes cria um serviço por PDB no momento do provisionamento. Se você não tiver certeza de qual container um nome de serviço resolve, o teste de conexão do Veesker reporta o nome do container a partir do resultado do handshake `V$DATABASE` antes de o perfil ser salvo.

## Como funciona a limitação por versão

A interface CDB/PDB no Veesker é condicional à versão do servidor. No 11g e anteriores, a árvore é plana, as views `CDB_` não existem, e a interface multi-tenant não aparece. No 12c e posteriores, a hierarquia é renderizada. No 23ai — onde instâncias não-CDB estão depreciadas — o Veesker assume multi-tenant por padrão.

Se você gerencia um ambiente misto com instâncias 11g ao lado de CDBs 19c e deployments 23ai, cada conexão se comporta corretamente para a versão que o servidor reporta. Não há configuração para alternar. O handshake determina a interface, não um arquivo de configuração.

Esse comportamento consciente de versão é parte do que torna um ambiente misto de múltiplas versões viável em uma única ferramenta. A alternativa é usar ferramentas diferentes por versão, ou desabilitar recursos de interface em toda a linha para manter a consistência no mínimo denominador comum. Nenhum dos dois é uma boa troca.

---

A Edição Comunitária do Veesker lida com conexões CDB e PDB, a árvore de objetos consciente de container e o contexto SQL multi-tenant sob a Apache 2.0 — sem assinatura Cloud necessária. [Baixe o Veesker](/download) e conecte-se ao seu ambiente Oracle como ele realmente é.

— *Veesker*
