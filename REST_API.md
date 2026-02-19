### CRIAÇÃO DE UMA REST API COM Fastify e Typescript

### Fastify:

- Microframework NodeJS para criação de APIs Rest

- Comunidade **ativa**, **rápido** e **pouco engessado**

### Typescript (instalação e execução):

<!-- Adiciona Runtime Type Checking ao código --> 

- JS com tipagem estática!

    ***define um novo tipo com o uso de interfaces***
    interface User {
        name: string
    }

    ***cria um objeto com o tipo definido***
    const user: User = { name: "Gabriel" }

- Necessita de **compilação!**

    **npm install -D typescript** <!-- Instalar o COMPILADOR Typescript -->

    **npm install -D @types/node** <!-- Necessário para o Node entender Typescript -->

    **npx tsc --init** <!-- Inicializa um arquivo "tsconfig.json" -->
 
    **npx tsc <file.ts>** <!-- Compila o arquivo <file.ts> em um arquivo .js -->

    <!-- Script para COMPILAÇÃO e EXECUÇÃO de Typescript -->
    ***"build": "npx tsc ./src/server.ts && node ./src/server.js"***

- **Operador de Asserção Não-Nula**

- Quando queremos acessar uma propriedade que pode ser nula, mas sabemos que não é, e o Typescript reclama:

-       interface User {
            name: string,
            age?: number
        }   

-       const user: User = {
            "Gabriel",
            age: 16
        }

        <!-- O ponto de exclamação avisa que o Typescript não precisa reclamar -->
-       const age: number = user.age!

### Configuração:

<!-- package.json -->
{
    "type": "commonjs"
}

<!-- tsconfig.json -->
{
    "module": "nodenext", <!-- Permite utilizar os recursos mais novos no NodeJS -->
    "target": "es2020",
    "moduleResolution": "nodenext",
    "verbatimModuleSyntax": false, <!-- Utilizar 'commonjs' -->
}

### TSX:

- Biblioteca para executar código **Typescript** mais facilmente

- Compila e Executa ***automaticamente***

**Ex:** ***npx tsx watch ./src/server.ts*** <!-- 'watch' deixa aplicação observando alterações --> 


### ESLint:

- Ferramenta de padronização de código


### Database:

- **SQLite:**
    > Banco de Dados Relacional
    > Código Aberto
    > Não precisamos de outras dependências
    > Único **arquivo local**

- **Conexão:**
    > Drivers Nativos ***comunicação baixo nível*** (MySQL, PostgreSQL, SQLite)
    > Query Builders ***abstração de linguagem SQL*** (KnexJS)
    > ORMs ***mais abstração ainda*** (Prisma, Drizzle)

### KnexJS:

-    ***npm install knex sqlite3 --save*** <!-- Knex com SQLite -->

-    ***npm install knex pg --save*** <!-- Knex com PostgreSQL -->

### Conexão com o Banco de Dados:


<!-- database.ts -->

import { knex as setupKnex, Knex } from "knex";

export const config: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: "./db/app.db" <!-- Caminho relativo ao diretório de onde o projeto está sendo executado -->
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations" <!-- Caminho relativo ao diretório de onde o projeto está sendo executado -->
    }
}

export const knex = setupKnex(config)

<!-- server.ts -->

- const tables = await knex(<table>).select('*') <!-- Exemplo de um 'SELECT * FROM table' -->

### Migrations:

- Espécie de controle de versão em um banco de dados


- "knex": ***node --import tsx ./node_modules/.bin/knex*** <!-- Script p/ executar o binário do Knex com Node utilizando tsx -->

- **Ex:** npm run knex -- migrate:make create-documents ***Executa o Knex com Typescript criando a migration***

### Construindo as Migrations com Knex:

- Migrations não devem ser editadas depois de criadas

<!-- 20260203042125_create_transactions.ts -->

import type { Knex } from "knex";

<!-- Cria a tabela TRANSACTIONS -->
- export async function up(knex: Knex): Promise<void> {
    // FAZ

    await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary()
        table.text("title").notNullable()
        
    })

  }

<!-- Exclui a tabela TRANSACTIONS -->
- export async function down(knex: Knex): Promise<void> {
    // DESFAZ
    await knex.schema.dropTable("transactions")
  }

- Para criar a migration: ***npm run knex -- migrate:latest***

- Para desfazer a migration: ***npm run knex -- migrate:rollback***

### Realizando Querys com Knex:

<!-- Insere uma nova "transaction" no BANCO DE DADOS -->

const transaction = await knex(<table>).insert({
    id: randomUUID(),
    title: "title test",
    amount: 1000
}).returning('*')

return transaction

### Variáveis de Ambiente:

- Informações baseadas no ambiente onde a aplicação é executada

- Arquivo **.env**

- Para ler o arquivo **.env** no Node, utilizamos a extensão: **dotenv**

    > ***npm install dotenv***

- Para utilizar importamos: ***import "dotenv/config"***

- Assim, todas as variáveis de ambiente ficam salvas no objeto global **process.env**

- É possível criar uma validação para ver se **process.env.<variável>** existe, afim de evitar erros na aplicação

- Cria-se um arquivo **.env.example** com os **NOMES** das **VARIÁVEIS** para outros desenvolvedores

### Zod:

- Biblioteca para validação de dados

- Criamos dentro de **/src**: **/env/index.ts**

<!-- src/env/index.ts -->
import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000)
})

<!-- coerce.number() convert "string" para "number" automaticamente -->

const env = envSchema.parse(process.env)

<!-- ZOD valida as informações de "process.env" e joga para a variável "env" -->

### Plugins do Fastify:

- Separar rotas em outros arquivos a fim de desacoplar-los da aplicação e tornar o código mais modular 

### Tipagem com Knex:

- O Knex é burro por padrão, não identifica as colunas de uma tabela automaticamente

- Criamos uma pasta: **@types/knex.d.ts** <!-- knex.d.ts é um arquivo de DEFINIÇÃO de tipos em Typescript -->

<!-- knex.d.ts -->

import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string,
            title: string,
            amount: number,
            created_at: string,
            session_id?: string 
        }
    }
}

### Utilizando Cookies no Fastify:

- Cookies são uma forma de manter um contexto entre requisições

- ***npm install @fastify/cookie***

<!-- Verifica se o Cookie existe -->
const session_id = req.cookies.session_id

<!-- Para setar um Cookie -->
res.cookie("session_id", session_id, {
    path: '/', <!-- Torna o Cookie disponível para todas as rotas  -->
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
})

- Para acessar o cookie: **req.cookies**

- **Middlewares:**
    > Interceptador de uma Request / Response
    > Executa algo antes do HANDLER de uma Rota

### Hook Global:

- Forma de ouvir eventos em todo ciclo de vida da aplicação

### Testes Automatizados:

- Garantir que a aplicação funcione corretamente

- Forma de manter a confiança na manutenção da aplicação conforme seu crescimento

- > **Unitários:** Unidades da aplicação.
- > **Integração:** Comunicação entre duas ou mais unidades da aplicação.
- > **E2E:** De ponta a ponta. Simulam um usuário utilizando a aplicação.

- **Pirâmide de Testes:**
    > Importância dos Testes
    > Ordem de Execução

- **Recomendado:** ***Testes E2E*** ( não dependem de tecnologia e arquitetura ) ( são lentos )

### Vitest x Jest

- ***Jest:*** Framework mais evoluído e maduro, requer muitas configurações

- ***Vitest:*** Framework mais rápido, poucas configurações

<!-- Estrutura - example.test.ts -->
import { expect, test } from "vitest"

test("1 + 2 = 3", () => {
    expect(1 + 2).toBe(3)
})

- Todo teste contém: **enunciado**, **operação** e **validação**

- Para executar: ***npx vitest*** ou

script {
    "test": "vitest"
}

=> ***npm run test***

### Vitest + Supertest

- Biblioteca que permite testar as rotas do servidor, sem precisar colocá-lo no ar

<!-- "supertest" -->
import request from "supertest"

const res = await request(app.server)
        .post("/transactions")
        .send({
            title: "new-transaction",
            amount: 5000,
            type: "credit"
        })

    expect(res.statusCode).toBe(201)

<!-- createTransaction.test.ts -->
import { expect, test, beforeAll } from "vitest"
import request from "supertest"
import { app } from "../src/app"

beforeAll( async () => { <!-- Executa antes de rodar os testes -->
    await app.ready() <!-- Verifica se o servidor está pronto para receber requisições -->
})

afterAll( async() => { <!-- Executa depois de rodar os testes -->
    await app.close() <!-- Encerra o servidor da memória -->
})

test("User can create a new transaction", async () => {
    const res = await request(app.server)
        .post("/transactions")
        .send({
            title: "new-transaction",
            amount: 5000,
            type: "credit"
        })

    expect(res.statusCode).toBe(201)

})

- Um teste não deve depender do resultado de outro teste! Caso isso aconteça, então estes testes devem estar juntos!

- O teste deve se adaptar ao código

### Deploy

- Deploy = Colocar no AR

- Existem MUITAS E MUITAS formas de realizar deploy

- Arquiteturas de Deploy

- **Projetos em Typescript** necessitam ser ***transpilados*** para **Javascript**

### TSUP:

- Bundler de **Typescript** e **Javascript**

- Converte código **TS** para **JS**

- Mais eficiente que **TSC**

- **Exemplo:**
    > ***tsup ./src*** <!-- Transpila a pasta /src de TS para JS na pasta /dist -->
    > ***tsup ./src --out-dir ./build *** <!-- Transpila a pasta /src de TS para JS na pasta /build -->

### Github CLI

- Criar e Gerenciar Repositórios no Github pelo Terminal

### Hospedagem

- **Render** => Plataforma de hospedagem com plano gratuito ( webapps, backend, websites, etc. )

- **Railway** => Outra plataforma

- Para aplicações ***REAIS***, hospedagem gratuita ***NÃO EXISTE***