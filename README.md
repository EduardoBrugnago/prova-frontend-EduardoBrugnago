# Prova Prática IPM - Eduardo Brugnago

## Introdução a abordagem

Analisando as 5 partes que eram solicitadas no documento, tomei a decisão de tentar fazer um projeto que unifica a **Parte 2 (Integração com APIs)** e **Parte 3 (Desenvolvimento da Interface)** e usando o planejamento pra esse projeto, responder as questões teoricas da **Parte 1 (Arquitetura de front-end)** com base nesse projeto, justificar algumas escolhas com base nele. Um exemplo é a questão `Como trataria autenticação, rotas protegidas e armazenamento do token;`, que é um ponto de arquitetura que depende do serviço, se ele ta estruturado por cookie, OAuth 2.0 ,Authorization Header (Bearer Token). Como vou usar API pública, essa escolha vai ser feita para encaixar ao serviço.

## Instruções de Execução

Requer **Node 20.19+ ou 22.12+**. Desenvolvido no Node 24.

```bash
npm install
cp .env.example .env.local   # opcional, o projeto tem fallback pra mesma URL
npm run dev
```

A aplicaçao sobe em `http://localhost:5173` e abre no login, porque `/products` e rota protegida.

**Credencial de teste:** `emilys` / `emilyspass`

| Script            | O que faz                                       |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | servidor de desenvolvimento                     |
| `npm run build`   | checagem de tipo (`tsc -b`) e build de produçao |
| `npm run preview` | serve o build gerado                            |
| `npm run lint`    | ESLint                                          |
| `npm run format`  | Prettier em tudo                                |

A unica variavel de ambiente e a `VITE_API_URL`, que aponta pra `https://dummyjson.com`. O `.env.local` fica fora do versionamento, por isso o `.env.example` versionado e o fallback em `app/config/env.ts` — sem nenhum dos dois o projeto ainda sobe. [IA 4](#4-instruções-de-execução)

## Parte 1: Arquitetura de front-end

### Questão 1

Você foi contratado para desenvolver um novo módulo de um ERP (ex.: Produtos e Estoque), que deverá consumir APIs de diversos microsserviços já existentes (Produtos, Estoque, Financeiro e Clientes).

> **Como você organizaria a estrutura de pastas e componentes da aplicação;**

Aqui eu prefiro seguir o modelo mais comum no mercado que ja leva em conta uma estrutura orientada ao domínio/feature, isolando cada API de forma modular, ter uma pasta `services/` com as integrações separadas por serviço e dentro de cada um ter suas chamadas, DTO e Hooks. Para parte visual de componentes, tambem separar por modulo (`modules/`), e genericos (`generic/`), para manter nos genericos os componentes como o nome diz não sao limitados a so uma vertical encaixam em multiplas e dessa forma facilitar qualquer tipo de atualização na identidade visual do app.

> **Como separaria componentes de apresentação, componentes de negócio e serviços de comunicação com APIs;**

Não sei se eu compreendi corretamente, por conta dos termos. Pelo oque eu entendi, deixaria isolado cada um desses pontos de forma linear `Apresentação (UI) <- Model/Hook(Regra de negocio) <- Serviços/Api` pra que cada um controle sua parte de forma individual e passe ja tratato de acordo com a regra de negocio pra seguinte fazer uso. Entao por exemplo:um componente de tabela(**Apresentação**) nao ter nenhum import de **Hook** ou **Serviço**, ele so receber o valor para exibir como **prop**, evitar qualquer tipo de calculo ou tratamento, deixando a funçao dela apenas de exibição. esse tratamento ficar como responsabilidade de um **Hook ou Model**, que vai receber o dado bruto da **API** (Essa com seu tratamento de erro e estado isolado) e tratar ele de acordo com as **regras de negocio**.

> **Como faria o gerenciamento de estado da aplicação (Context API, Zustand, Redux, TanStack Query ou outra abordagem);**

Esse depende muito do escopo do projeto e conhecimento da equipe tecnica, Context API ja nao vejo muito sentido. Ja que consome diversos microsserviços e tem um grau maior de regras de estado, daria pra usar tanto o **Zustand + TanStack Query** ou **Redux Toolkit + RTK Query**, ambos são ferramentar que fazem sentido nesse contexto. Pro projeto que vou criar pra **Parte 2 e 3**, vou escolher **Redux Toolkit + RTK Query** pois é um que eu tenho mais experiência usando.

Pra estrurua utilizaria **Redux Toolkit** pra gerenciar o estado global da aplicação e o **RTK Query** pra o gerenciamento de dados dos microsserviços. Organizando o estado por domínio, cada módulo com seu próprio slice e API. O **RTK Query** fica responsável por cache, loading, erros e invalidação dos dados, enquanto os slices cuida de estados da interface, como filtros, seleções e preferências.

> **Como trataria autenticação, rotas protegidas e armazenamento do token;**

Aqui como deixei de exemplo na introdução, depende muito de como sçao as regras do backend. Pra essa pergunta acredito que fica muito vago de responder um escolha. O que eu posso trazer são opçoes e pontos pra cada topico:

1. **Autenticação e armazenamento do token:** Aqui dependeria se cada microsserviço tem um autenticação propria ou compartilhada, isso afeta como vai ser feito o controle da sessão, armazenamento e refresh. Outro ponto que afeta é o tipo ser por Cookie, OAuth 2.0 ,Authorization Header (Bearer Token). Que isso influencia se vai ser armazenado por localStorage, Cookie httpOnly ou um misto que salva na memoria e faz o refresh por cookie;

2. **Rotas protegidas:** Esse de estrutura da pra usar um Guard padrao de React-Router, ai pontos que são necessarios alinhar é o tipo de permisçao, se vai ser granular ou por role. E qual a forma que vai ter acesso a essa classificaçao da permisão, se vai ser direto no JWT ou por um endpoit que retorna o detalhe do granular ou a role;

> **Como pensaria em tratamento global de erros, loading e feedback ao usuário;**

O controle de estado disso vem do Redux, então uso esse controle pra devolver feedback ao usuário com Skeletons, Toasts e modais de confirmação. Por experiência própria, com microsserviços eu gosto de ter um ponto único controlando toda a comunicação com as APIs. Pra isso eu usaria axios como cliente HTTP, conectado ao RTK Query através de um axiosBaseQuery e nele q justamente que dá pra centralizar o attach do token, o refresh e a normalização dos erros.

A ideia é desse interceptador converte qualquer formato de erro dos serviços num objeto único antes de sair da camada de integração. Isso pra evitar mensagem genérica de "Erro 503 - Contate o suporte", ai dá pra dizer qual módulo quebrou mesmo quando o backend não detalha.O axiosBaseQuery devolve esse objeto no error, ele chega já tipado nos hooks.Ai normalizado, o disparo do feedback fica num middleware do Redux. Assim toda query que falha tem tratamento padrão, sem depender de lembrar de tratar em cada chamada. E ja separa o destino de cada tipo de erro(400, 401, 403, etc.).

Pra feedback de loading da pra separar o isLoading de isFetching, ai a primeira carga mostra Skeleton e refetch ou troca de estado mostram um Linear/Circular Progress sobreposto e mantendo os dados na tela, sem troca de layout. E o controle desses loading e erros fica isolado pra cada serviço.

### Questão 2

Explique como você estruturaria um projeto React de médio/grande porte para facilitar manutenção e evolução.

> Componentização;

Esse processo depende de como esta o andamento do time de design, no mundo perfeito que é entregado o manual de fonts e cores, ai eu sigo o seguinte fluxo: Inicio configurando arquivos de tema do projeto, separando cores, fonts, padroes de textos. Esse arquivos normalmente seguindo a base de um Design System pra utilizar eles. Depois eu normalmente separo em duas categorias de componentes:

1. Componentes genericos: Aqueles que tem multipla utilizaçao nas diferentes paginas e normalmente são padronizados. Por exemplo: Inputs, Buttons, Tables, Titles, Skeletons, Drawers, Modals, etc.)

2. Componentes de pagina: São os que tem uso exclusivo de uma pagina, que nao tem utilização em nenhuma outra. Por exemplo: Um card de produto, que é exibido em um grid de loja. Um filtro contruido com Inputs genericos.

Inicio com os genericos utilizando sempre os temas configurados, pra evitar variaçao de cores, fonts e tamanhos, para depois contruir as paginas utilizando eles e nesse processo ir criando os componentes de pagina pra suprir oq nao tem nos genericos. Eu faço nesse fluxo porque agiliza o desenvolvimento em primeiro ter todas ferramentas basicas montadas e ir plotando de maneira agil multiplas telas. Alem disso essa separaçao de tema e componentes genericos, fica mais facil para manutenção e modificações de identidade do projeto, ja que tudo fica centralizado, caso precise trocar palleta do projeto ou algum outro aspecto visual, fica mais agil e facil de ajustar e encontrar os arquivos.

> Hooks customizados;

Apos montar o mockup das paginas, ai começo a verificar as rotas da api e de que maneira vou criar os hooks de acordo com as regra de negócio, é ai ligo o serviço com a tela. Seguindo oq comentei na **Questão 1** (`Apresentação <- Hook <- Serviço`), tento estruturar o hook como intermediario: ele chama o serviço, trata o retorno, aplica oq a regra pede (filtro, calculo, ordenaçao, formataçao) e devolve pro componente só aquilo que ele precisa exibir. Assim a pagina importa um hook só e nao tem responsabilidade alem de exibir o dado ou um input.

Na estrutura eu separo eles em dois lugares igual os componentes: os que tem rota/dominio ficam dentro do proprio modulo/pagina, e os que nao tem nada de dominio ficam na pasta de genericos igual os componentes, tipo `useDebounce`, `useDisclosure`, `usePagination`, `useLocalStorage`. Dependendo das bibliotecas, tipo o **RTK Query**, ela ja gera os hooks de request (`useGetProductsQuery`), mas normalmente eu nao uso ele direto na tela, envolvo num hook do modulo (`useProductsList`) pra manter o ponto de mudança centralizado. Se o backend mudar ou eu precisar trocar a fonte do dado, muda só dentro daquele hook e evita quebrar algum componente.

> Reutilização de código;

A reutilização eu tento resolver primeiro pelo tema e pelos genericos, que é oq comentei. Tudo que nao é preso a um dominio vai pra `generic/` (components, hooks, utils, theme) e oq é do dominio fica dentro de `modules/`. Isso tambem pros tipos e DTOs, que ficam junto do serviço em `services/`, entao o mesmo tipo é usado pelo hook, pelo componente e pelo teste, sem redeclarar interface por conta propria. Outro ponto forte de reuso é o `axiosBaseQuery` que tbm citei na **Questão 1**: token, refresh e normalizaçao de erro escritos uma vez só e herdados por todos os serviços.

Mas eu evito abstrair cedo demais. Normalmente só promovo alguma coisa pra `generic/` depois que ela ja apareceu em dois ou tres lugares diferentes, pra evitar virar aquele componente com 15 props que ninguem entende mais. Prefiro repetir um pouco no começo e generalizar depois, quando ja da pra enxergar oq realmente varia.

> Separação entre regras de negócio e interface;

Esse ponto eu ja toquei na **Questão 1**', ele aparece na propria estrutura de pastas. `services/` cuida da API, `modules/` guarda a regra e o estado, e o componente só recebe prop e renderiza. Formataçao (moeda, data, mascara) eu deixo como um util generico e o hook ja entrega o valor pronto pra exibir. Isso ajuda em dois momentos: quando o design muda, mexo só no componente e o comportamento continua igual; e quando a regra muda, mexo só no hook e nenhuma tela precisa ser tocada. Fora que agiliza bastante testes, porque a maior parte do que pode quebrar fica em funçao pura e hook, sem precisar renderizar nada pra validar.

> Estratégias para testes;

Como a regra fica isolada em hook e util, o grosso do teste é unitario ali, usando **Vitest + Testing Library** pro que precisa de render. Pros hooks da pra usar `renderHook` resolve bem, e nos utils é teste puro de entrada e saida, que é facil de escrever e roda rapido.

Pra parte de integraçao com as APIs normalmente nao uso mock de rede, prefiro validar com a API de verdade. Antes de escrever o serviço eu exploro os endpoints no Postman (ou no Swagger, quando o backend disponibiliza) pra ver a resposta real, o formato do erro. Ja os estados de loading e de erro eu verifico direto no navegador. Com throttling de banda da pra ver o Skeleton e conferir se nao tem layout shift, e no modo Offline da pra ver o caminho de erro de rede, o toast e o retry funcionando. Tbm bloqueando so uma request especifica pra simular falha parcial tambem.

> Boas práticas que costuma seguir.

Algumas coisas que eu costumo priorizar:

1. **TypeScript sem `any` e `undefined`:** tipo vindo do serviço e nao redeclarado na tela, com o strict ligado;

2. **Lint e formataçao automatizados:** ESLint + Prettier configurados no projeto e rodando no commit, pra facilitar leitura de merge review;

3. **Padrão de nome e de pasta:** o mesmo nome do dominio repetido em `services/`, `modules/` e na rota;

4. **Commits e PRs pequenos:** o foco é sempre tentar atomizar os commits deixando eles pequenos, as vezes nao tem escapatoria principalmente em configuraçao base de projeto, mas a ideia é sempre tentar minimizar pra ter um review mais simples;

5. **Componente pequeno e sem prop drilling:** evito sempre prop por tres niveis, soluçao é sempre store/contexto, ou a composiçao ta errada;

6. **Env:** tudo por `.env` e variavel de ambiente, com o arquivo fora do versionamento.

## Parte 2 e 3: Api e Interface

### Escolha das libs

Como API publica escolhi a DummyJSON, ela tem Autenticação com JWT, CRUD de produto, categoria e busca. A escolha inicial tinha sido a Platzi Fake Store API e mudou no meio da implementaçao, o motivo esta em [Troca da API publica](#troca-da-api-publica). Depois disso montei a stack seguindo oq respondi na **Parte 1**. [IA 1](#1-escolha-da-api-pública)

| Pacote                                                                         | Onde entra                                                                                                                                                              |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@reduxjs/toolkit` + `react-redux`                                             | store em `app/store`, slices de estado de interface em `modules/*/store` e as APIs do RTK Query em `services/`                                                          |
| `axios`                                                                        | cliente HTTP do `axiosBaseQuery` em `services/api`, pra centralizar o attach do token, o refresh e a normalizaçao de erro                                               |
| `react-router-dom`                                                             | rotas em `app/router` e o Guard das rotas                                                                                                                               |
| `@mui/material` + `@emotion/react` + `@emotion/styled` + `@mui/icons-material` | É um Design Sistem com bastante opçao que eu ja tenho bastante experiencia. Vou usar o tema em `generic/theme` e os componentes genericos em `generic/components`       |
| `react-hook-form` + `zod` + `@hookform/resolvers`                              | Tambem são libs que tenho bastante experiencia e bem simples de implementar pra esse escopo. Validaçao dos formularios de login e de produto, com erro inline por campo |

E as de desenvolvimento:

| Pacote                                                                                 | Pra que                                                                                                    |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `vitest` + `jsdom`                                                                     | runner dos testes de hook e util, ja encaixa direto com o Vite do projeto                                  |
| `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event` | teste de componente e o `renderHook` que citei na **Questão 2**                                            |
| `prettier` + `eslint-config-prettier`                                                  | formataçao automatica, com o config desligando as regras de estilo do ESLint pra um nao brigar com o outro |

### Configuraçao do tema e componentes genericos

Como nao tem mockup, peguei so uma paleta de cor simples e configurei algumas variaçoes de fonts que eu usei em alguns projetos recentes e peguei um modelo que eu tenho pronto de tema do MUI e so coloquei as cores e fonts nele.

Pra iniciar o mapeamento dos componentes genericos, primeiro listei oq é preciso para um CRUD, que vai ser:

Input, Button, Skeleton, Table, Pagination.

Desses cinco, o Button já vem pronto do MUI e o tema em `generic/theme` já padroniza ele (sem caixa alta, sem elevação), então não precisa de componente próprio. Os outros repetem comportamento em toda tela de CRUD e viram genéricos em `generic/components`:

| Componente | O que resolve                                                                                        | Onde entra                       |
| ---------- | ---------------------------------------------------------------------------------------------------- | -------------------------------- |
| Input      | Ligar o campo ao `react-hook-form` e joga o erro do Zod embaixo do campo                             | Login e cadastros                |
| Tabela     | Receber as colunas e forma de renderizar as linhas; 3 estados: carregando, vazio e erro              | Listagem de produto e de usuário |
| Skeleton   | Tabela com o mesmo número de coluna e de linha da página, pra primeira carga não dar troca de layout | Uso na tabela com `isLoading`    |
| Paginação  | Paginação generica com "Anterior / Próximo" e Seleçao de pagina                                      | Rodapé da tabela                 |
| Modal      | Confirmação de ação                                                                                  | Exclusão de produto e de usuário |

Vai ser preciso dois hooks em `generic`: `useDebounce`, pro filtro de nome não disparar uma request a cada tecla, e `useDisclosure`, pro controle de abrir e fechar do modal.

### Estrutura de pastas

Montei usando o conceito que passei _Parte 1_*, três camadas, cada uma com uma responsabilidade: `services/` pra API, `modules/` para rota e tela, `generic/` items de uso multiplo. A dependência é unidirecional ,`services/` nunca importa de `modules/`. [IA 2](#2-árvore-de-pastas-no-readme)

```
src/
│
├── app/                        # infraestrutura
│   ├── config/                 # env e permissões
│   ├── providers/              # Redux + tema + router + toast
│   ├── router/                 # rotas e os guards de auth
│   ├── store/                  # configureStore, hooks tipados e controle de erro
│   └── App.tsx
│
├── services/                   # API
│   ├── api/                    # axios, interceptors e o axiosBaseQuery
│   ├── auth/
│   ├── products/               # cada pasta com client, endpoints, DTO e a api do RTKQ
│   ├── categories/
│   └── users/
│
├── modules/                    # Modulos/Dominios
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm/
│   │   ├── hooks/
│   │   ├── model/
│   │   ├── pages/
│   │   │   └── LoginPage/      # index da(s) pagina(s) desse modulo
│   │   └── store/
│   ├── products/
│   │   ├── components/         # componentes do domínio (tabela, form, filtros)
│   │   ├── mappers/            # DTO <-> modelo de domínio
│   │   ├── model/              # tipos e regras, sem React
│   │   ├── pages/
│   │   └── store/              # slice de filtro e seleção
│   ├── categories/
│   │   ├── hooks/
│   │   ├── mappers/
│   │   └── model/
│   └── users/
│       ├── hooks/
│       ├── mappers/
│       └── model/
│
├── generic/                    # Uso espalhado pelos modules
│   ├── components/             # Input, Tabela, Skeleton, Paginação, Confirmação
│   ├── hooks/                  # useDebounce, useDisclosure
│   ├── theme/
│   │   ├── colors.ts           # paleta de cor
│   │   ├── fonts.ts            # família, peso e escala de tamanho
│   │   ├── theme.ts            # tema do MUI
│   │   └── index.ts
│   └── utils/
│
├── assets/
├── index.css
└── main.tsx
```

### Autenticaçao e Guard

O fluxo do login e: envia usuario e senha e recebe `accessToken` e `refreshToken` em `/auth/login`, guarda o refresh, busca o `/auth/me` e so entao marca a sessao como autenticada. Credencial de teste: `emilys` / `emilyspass`.

| Decisao                                                                                    | Por que                                                                                                             |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Tres interceptors em `services/api`: anexar token, refresh com fila e normalizaçao de erro | ponto unico pra cada uma das tres coisas. E o `normalizeError` tratar as mensagens de erro                          |
| Refresh com fila, e nao um refresh por chamada                                             | evitar que 401 de multiplas chamadas pedirem refresh e o invalidar o token da proxima request, deslogando o usuario |
| `authBridge` em vez do interceptor importar o store                                        | o interceptor precisa do token que esta no store. Com essa ponte o `services/` nunca importe de `modules/`          |

O Guard é o `ProtectedRoute` em `app/router` - rota protegida sem sessao manda pro `/login` e o `PublicRoute` faz o contrario, devolve quem ja esta logado pra rota que tentou abrir.

### Troca da API publica

A escolha inicial foi a Platzi Fake Store API, e a integraçao inteira foi feita em cima dela. No meio da integraçao ao ligar o cadastro, descobri que a parte de escrita estava quebrada: `POST` e `PUT` devolvem `500 Internal server error`, inclusive testando pelo Swagger deles. Leitura e login continuam de pe, que foi justamente o que testei antes de escolher. [IA 3](#3-mapeamento-da-troca-de-api)

A ressalva da DummyJSON e que ela simula escrita: `POST /products/add` volta 201 com o objeto, mas o item nao persiste. Como o enunciado pede cadastro, ediçao e exclusao funcionando na tela, resolvi com atualizaçao otimista de cache.

### Redux, paginaçao e filtro

Um store em `app/store`. O Redux Query gera os hooks dentro de `services/` e cuida de cache, dedupe e dos estados de carga; o estado de interface fica em slice do modulo, que hoje e o `productsFilters` em `modules/products/store` com nome, faixa de preço, ordenaçao, pagina e tamanho de pagina.

A divisao entre o que vai pro servidor e o que fica no front segue o que a API sabe fazer:

| Ponto           | Onde roda                       | Por que                                  |
| --------------- | ------------------------------- | ---------------------------------------- |
| Filtro por nome | servidor, `/products/search?q=` | e endpoint proprio da API                |
| Ordenaçao       | servidor, `sortBy` + `order`    | a API ordena nas duas rotas de listagem  |
| Faixa de preço  | front, em `product.rules.ts`    | a API nao tem parametro de preço         |
| Paginaçao       | front                           | com `limit=0` o resultado ja vem inteiro |

O filtro de preço e a paginaçao moram em `modules/products/model/product.rules.ts`, funçoes puras sem React (**Parte 1**). A categoria continua sendo carregada pelo modulo `categories`, mas so pra alimentar o formulario e o nome que aparece na tabela.

**Atualizaçao otimista na ediçao e na exclusao.** Como a API simula escrita, nenhuma das tres mutations invalida tag pra nao disparar um refetch que traria a lista original e desfaria o que o usuario acabou de fazer. Ediçao e exclusao aplicam o resultado direto no cache do Redux Query, e desfazem o patch se a request falhar. Como filtro e ordenaçao viram entradas de cache diferentes, o patch e aplicado em todas as ja buscadas.

O cadastro ficou de fora, o `POST` sai de verdade e a API responde 201, mas o produto nao existe no server.Optei por retornar so com o toast de sucesso, pra nao gerar confusao na listagem e ediçao.

## Parte 4: Pergunta de Perfil

### Questão 5

> **Conte sobre um projeto (profissional, acadêmico ou pessoal) que considera representar melhor seu nível técnico. Qual foi sua participação e quais foram os principais desafios?**

Um projeto que considero representar bem meu nível técnico foi o desenvolvimento do aplicativo da Bewiki, que desenvolvi em 2024, uma plataforma que funcionava como um HUB de serviços integrados a condomínios, permitindo aos usuários contratar serviços como coworking, moradia, atendimento médico e alimentação.

Atuei como desenvolvedor pleno em uma equipe composta por um gestor, três desenvolvedores Front-end, dois Back-end e uma equipe de QA. Fui responsável principalmente pelo desenvolvimento e integração dos métodos de pagamento, além dos sistemas de contratação de coworking e imóveis. O aplicativo era desenvolvido em React Native, utilizando TypeScript, Redux e ApiSauce, e por ser um projeto legado, um dos principais desafios era trabalhar com uma base de código já existente enquanto o modelo de negócio do cliente estava em constante evolução, ai sempre foi necessario adaptar funcionalidades para atender novas necessidades ou prevenir problemas de operaçao deles que surgiam.

Considero que esse projeto representa bem meu nível técnico justamente pela combinação entre desenvolvimento de funcionalidades complexas, integração com serviços externos, manutenção de um sistema legado e a responsabilidade de atuar com maior autonomia dentro da equipe.

> **Descreva uma tecnologia, linguagem ou ferramenta que precisou aprender recentemente. Como foi esse processo?**

Recentemente, comecei a trabalhar em um projeto de pesquisa para a UFSC que utiliza o Google Earth Engine (GEE) para análise de imagens de satélite. Precisei aprender tanto a utilizar o GEE integrado a uma aplicação ReactJS, quanto conceitos relacionados à análise e interpretação de imagens de satélite, como bandas espectrais e a nomenclatura utilizada na área. Para isso, utilizei principalmente a documentação oficial do Google, analisei o código legado do projeto e fiz bastante experimentação, utilizando tanto o GEE diretamente quanto ferramentas como o QGIS.

Por já ter experiência com JavaScript e React.js, a parte de integração e desenvolvimento foi relativamente tranquila. O principal desafio foi entender os conceitos específicos de análise costeira

> **Como você utiliza ferramentas de IA no seu dia a dia? Em quais situações elas ajudam mais e em quais prefere não utilizá-las?**

Utilizo ferramentas de IA principalmente como apoio ao desenvolvimento. No dia a dia, uso para auxiliar em reviews de merge, documentação, criação de tipagens, análise de possíveis refatorações, criação de testes e também para pesquisar opções de bibliotecas e ferramentas.

Acredito que ela ajuda principalmente em tarefas repetitivas, como criação de tipagens, identificação de duplicação de codigo e revisão de trechos de codigo. É uma ferramenta util pra reduzir o tempo gasto em tarefas mais mecânicas e focar mais na solução do problema.

Prefiro não utilizar a IA como substituta do meu entendimento tecnico. Normalmente leio a documentação e o codigo existente para entender o contexto e só depois utilizo a IA como uma ferramenta de apoio. Assim consigo avaliar melhor as sugestões e validar se a solução realmente faz sentido, em vez de simplesmente aplicar o que foi gerado.

> **Existe alguma prática de desenvolvimento ou engenharia de software que você considera essencial em equipes de alta qualidade? Explique o motivo.**

Acho que Code Review é uma prática essencial, principalmente para qualidade. Para mim, ele não serve apenas para identificar bugs, mas também para manter comunicaçao e troca de conhecimento/perspectiva entre os desenvolvedores, atraves de discutir decisões técnicas antes que elas cheguem à produção.

## Parte 5: Portfólio

### Questão 6

**Repositório principal:** [https://codigos.ufsc.br/loc/cassie](https://codigos.ufsc.br/loc/cassie)
**Equipe:** [https://cassiecore.paginas.ufsc.br/equipe-atual/](https://cassiecore.paginas.ufsc.br/equipe-atual/)

### Sobre o projeto: CASSIE CoRe®

**Qual problema resolve**

O objetivo geral deste projeto é definir metodologia técnica e operacional e desenvolver uma plataforma web que disponibilize serviço de informação derivada de satélite e inteligência artificial (e.g. linha de costa, topografia, batimetria, compressão costeira, hidrodinâmica) para criação de acervo aplicados à mitigação e adaptação da zona costeira a mudanças do clima.

**Principais decisões técnicas**

- **Adaptação de scripts do Google Earth Engine e de rotinas em Python para módulos
  de aplicação.** O material de origem era código de análise escrito para execução
  pontual, não para rodar dentro de um produto. Converti isso em módulos de análise
  de linha de costa e de estimativa de profundidade de maré com interface e ciclo de
  vida definidos.
- **Separação dos novos módulos com fronteiras explícitas, em vez de seguir o padrão
  do código legado.** O restante do projeto compartilhava estado e componentes de
  forma difusa, o que tornava qualquer alteração arriscada. Optei por isolar os
  módulos novos, estado próprio e dependência mínima do que era compartilhado,
  aceitando alguma duplicação em troca de manutenibilidade e de poder evoluir cada
  análise sem efeito colateral nos demais módulos.

**O que eu faria diferente hoje**

Trataria o refactor dos módulos legados como parte do escopo, e não como algo
posterior. Isolar o novo resolveu o problema imediato, mas manteve essa diferença de base entre alguns modulos.
Os dois pontos que eu faria primeiro são a camada de componentes compartilhados e o uso do Redux,
hoje aplicado sem uma separação clara entre estado de servidor e estado de interface, apenas como uma forma de cache.

**Maior desafio**

Implementar melhorias em módulos antigos como o **Intermare**. Como o estado era manipulado
diretamente e a componentização não seguia limites de responsabilidade, mudanças
pontuais afetavam outros modulos. Foi necessário mapear o fluxo de dados existente
antes de qualquer alteração , o que consumiu mais tempo de leitura de código do que de escrita.
Alem disso o codigo era muito denso e nao separava funçao pura de interface, de maneira que dificultava a leitura dos arquivos.

## Uso de IA

Uso IA como ferramenta de apoio, principalmente pra levantar opção e acelerar pesquisa, mas a decisão e a justificativa continuam sendo minhas, todo retorno que usei aqui eu validei antes de adotar. Abaixo o registro dos pontos onde usei durante a prova. Cada uso está numerado aqui embaixo e marcado com `[IA n]` no ponto do README onde ele entrou.

### 1. Escolha da API pública

Antes de começar a Parte 2 eu precisava achar uma API pública dava conta do enunciado inteiro, pra nao descobrir no meio do caminho que faltava algo. Prompt que usei:

```
Preciso de uma API REST de CRUD pública e gratuita pra um teste técnico de front-end.
A aplicação precisa ter:
- tela de listagem
- cadastro, edição e exclusão
- paginação
- filtro
- validação de formulário
- feedback visual de sucesso e erro das operações
- autenticação, se possível

Quais opções atendem isso e qual você recomenda?
```

Voltaram duas opções viáveis:

|                              | Platzi Fake Store API         | DummyJSON                  |
| ---------------------------- | ----------------------------- | -------------------------- |
| Listagem                     | sim                           | sim                        |
| Cadastro / edição / exclusão | persiste de verdade           | responde 200 mas nao salva |
| Paginação                    | `offset` + `limit`            | `skip` + `limit`           |
| Filtro por nome              | `?title=`                     | `/products/search?q=`      |
| Faixa de preço               | `?price_min=` e `?price_max=` | nao tem                    |
| Categorias pro filtro        | `/categories`                 | sim                        |
| Autenticação                 | JWT com access + refresh      | JWT                        |
| Erro 400 com campo           | sim                           | raramente                  |

Escolhi a **Platzi** por 3 motivos:

1. Por ter mais opçao de filtro o que facilita controle de paginaçao.

2. Pelo CRUD persistir. Na DummyJSON o `POST` e o `PUT` respondem 200
   mas nao salvam nada e ainda devolve 400 com o campo que falhou, que é o que alimenta o erro inline no formulário

3. Tem `/auth` com access e refresh token de verdade, ai fica melhor que criar uma estrutura so por mockup.

### 2. Árvore de pastas no README

Com as pastas já criadas, quis deixar melhor a escrita no README pra explicar a separação das camadas e desenhar isso em texto fica mais rapido por IA. Prompt que usei:

```
Leia a estrutura de pastas de `src/` e escreva em markdown uma seção com
essa árvore, com foco em leitura e apenas com: bloco de código, indentação.
```

O retorno é o bloco da seção [Estrutura de pastas](#estrutura-de-pastas). Conferi as pasta e adicionei alguns comentarios nelas pra ficar facil de compreender.

### 3. Mapeamento da troca de API

Durante a integraçao descobrir que POST/PUT da Platzi tava com erro, precisava saber o peso de trocar de API antes de decidir. Prompt que usei:

```
Tenho uma aplicaçao React integrada com a Platzi Fake Store API, dividida em
services/ (client axios, DTO e RTK Query), modules/ (model, mapper, hooks, store)
e generic/ (componentes e tema).

Considerando a DummyJSON(https://dummyjson.com/docs) como substituta, lista o que precisa mudar em cada camada,
quais arquivos ficam intactos, e onde os contratos das duas APIs divergem.
```

O retorno virou a lista de arquivos e a estimativa que usei pra decidir. Antes de escrever qualquer DTO eu bati todos os contratos com `curl`. Duas coisas que so apareceram nesse teste e nao estavam no retorno: credencial errada volta 400 em vez de 401, e busca e categoria sao endpoints que nao combinam.

### 4. Instruções de Execução

Com o projeto ja fechado, o que faltava era descrever como rodar. Como e informaçao que ja esta toda no repositorio, pedi pra ler e montar a seçao. Prompt que usei:

```
Le o package.json, o .env.example e a configuraçao do Vite desse projeto e escreve
a seçao "Instruções de Execução" do README: versao minima do Node, passo a passo
pra rodar, tabela dos scripts e as variaveis de ambiente.
```

O retorno é a seção [Instruções de Execução](#instruções-de-execução). Conferi cada dado na fonte: a versao minima do Node saiu do `engines` do proprio Vite, os scripts do `package.json` e a variavel do `.env.example`.
