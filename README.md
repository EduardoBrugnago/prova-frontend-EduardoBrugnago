# Prova Prática IPM - Eduardo Brugnago

## Introdução a abordagem

Analisando as 5 partes que eram solicitadas no documento da Prova Prática, tomei a decisão de tentar fazer um projeto que unifica a **Parte 2 (Integração com APIs)** e **Parte 3 (Desenvolvimento da Interface)** e usando o planejamento pra esse projeto, responder as questões teoricas da **Parte 1 (Arquitetura de front-end)** com base nesse projeto, justificar algumas escolhas com base nele. Um exemplo é a questão `Como trataria autenticação, rotas protegidas e armazenamento do token;`, que é um ponto de arquitetura que depende do serviço, se ele ta estruturado por cookie, OAuth 2.0 ,Authorization Header (Bearer Token). Como vou usar API pública, essa escolha vai ser feita para encaixar ao serviço.



## Instruções de Execução


## Parte 1: Arquitetura de front-end

### Questão 1

Você foi contratado para desenvolver um novo módulo de um ERP (ex.: Produtos e Estoque), que deverá consumir APIs de diversos microsserviços já existentes (Produtos, Estoque, Financeiro e Clientes).


> **Como você organizaria a estrutura de pastas e componentes da aplicação;**

Aqui eu prefiro seguir o modelo mais comum no mercado que ja leva em conta uma estrutura orientada ao domínio/feature, isolando cada API de forma modular, ter uma pasta `services/` com as integrações separadas por serviço e dentro de cada um ter suas chamadas, DTO e Hooks. Para parte visual de componentes, tambem separar por modulo (`modules/`), e genericos (`generic/`), para manter nos genericos os componentes como o nome diz não sao limitados a so uma vertical encaixam em multiplas e dessa forma facilitar qualquer tipo de atualização na identidade visual do app.


> **Como separaria componentes de apresentação, componentes de negócio e serviços de comunicação com APIs;**

Não sei se eu compreendi corretamente, por conta dos termos. Pelo oque eu entendi, deixaria isolado cada um desses pontos de forma linear `Apresentação (UI) <- Model/Hook(Regra de negocio) <- Serviços/Api` pra que cada um controle sua parte de forma individual e passe ja tratato de acordo com a regra de negocio pra seguinte fazer uso. Entao por exemplo:um componente de tabela(**Apresentação**) nao ter nenhum import de **Hook** ou **Serviço**, ele so receber o valor para exibir como **prop**, evitar qualquer tipo de calculo ou tratamento, deixando a funçao dela apenas de exibição. esse tratamento ficar como responsabilidade de um **Hook ou Model**, que vai receber o dado bruto da **API** (Essa com seu tratamento de erro e estado isolado) e tratar ele de acordo com as **regras de negocio**.


> **Como faria o gerenciamento de estado da aplicação (Context API, Zustand, Redux, TanStack Query ou outra abordagem);**

Esse depende muito do escopo do projeto e conhecimento da equipe tecnica, Context API ja nao vejo muito sentido. Ja que consome diversos microsserviços e tem um grau maior de regras de estado, daria pra usar tanto o **Zustand + TanStack Query** ou **Redux Toolkit + RTK Query**, ambos são ferramentar que fazem sentido nesse contexto. Pro projeto que vou criar pra **Parte 2 e 3**, vou escolher **Redux Toolkit + RTK Query** pois é um que eu tenho mais experiência usando.

Pra estrurua  utilizaria **Redux Toolkit** pra gerenciar o estado global da aplicação e o **RTK Query** pra o gerenciamento de dados dos microsserviços. Organizando o estado por domínio, cada módulo com seu próprio slice e API. O **RTK Query** fica responsável por cache, loading, erros e invalidação dos dados, enquanto os slices cuida de estados da interface, como filtros, seleções e preferências.


> **Como trataria autenticação, rotas protegidas e armazenamento do token;**

Aqui como deixei de exemplo na introdução, depende muito de como sçao as regras do backend. Pra essa pergunta acredito que fica muito vago de responder um escolha. O que eu posso trazer são opçoes e pontos pra cada topico:

1. **Autenticação e armazenamento do token:** Aqui dependeria se cada microsserviço tem um autenticação propria ou compartilhada, isso afeta como vai ser feito o controle da sessão, armazenamento e refresh. Outro ponto que afeta é o tipo ser por Cookie, OAuth 2.0 ,Authorization Header (Bearer Token). Que isso influencia se vai ser armazenado por localStorage, Cookie httpOnly ou um misto que salva na memoria e faz o refresh por cookie; 

2. **Rotas protegidas:** Esse de estrutura da pra usar um Guard padrao de React-Router, ai pontos que são necessarios alinhar é o tipo de permisçao, se vai ser granular ou por role. E qual a forma que vai ter acesso a essa classificaçao da permisão, se vai ser direto no JWT ou por um endpoit que retorna o detalhe do granular ou a role;


> **Como pensaria em tratamento global de erros, loading e feedback ao usuário;**

O controle de estado disso vem do Redux, então uso esse controle pra devolver feedback ao usuário com Skeletons, Toasts e modais de confirmação. Por experiência própria, com microsserviços eu gosto de ter um ponto único controlando toda a comunicação com as APIs. Pra isso eu usaria axios como cliente HTTP, conectado ao RTK Query através de um axiosBaseQuery e nele q justamente que dá pra centralizar o attach do token, o refresh e a normalização dos erros.

A ideia é desse interceptador converte qualquer formato de erro dos serviços num objeto único antes de sair da camada de integração. Isso pra evitar mensagem genérica de "Erro 503 - Contate o suporte", ai dá pra dizer qual módulo quebrou mesmo quando o backend não detalha.O axiosBaseQuery devolve esse objeto no error, ele chega já tipado nos hooks.Ai normalizado, o disparo do feedback fica num middleware do Redux. Assim toda query que falha tem tratamento padrão, sem depender de lembrar de tratar em cada chamada. E ja separa o destino de cada tipo de erro(400, 401, 403, etc.).

Pra feedback de loading da pra separar o isLoading de isFetching, ai a primeira carga mostra Skeleton e refetch ou troca de estado mostram um  Linear/Circular Progress sobreposto e mantendo os dados na tela, sem troca de layout. E o controle desses loading e erros fica isolado pra cada serviço.


### Questão 2

Explique como você estruturaria um projeto React de médio/grande porte para facilitar manutenção e evolução.

> Componentização;

> Hooks customizados;

> Reutilização de código;

> Separação entre regras de negócio e interface;

> Estratégias para testes;

> Boas práticas que costuma seguir.