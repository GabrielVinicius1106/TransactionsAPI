# TransactionsAPI

Uma API RESTful para gerenciar transações financeiras, construída com Node.js, TypeScript, Express e Knex.js. A API suporta gerenciamento de transações baseado em sessão, incluindo criação, listagem e resumo de transações. Utiliza banco de dados SQLite e segue boas práticas de estruturação e uso de middlewares.

---

## Índice
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas da API](#rotas-da-api)
- [Banco de Dados](#banco-de-dados)
- [Instalação e Configuração](#instalação-e-configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)

---

## Funcionalidades
- Criar, listar e resumir transações financeiras
- Gerenciamento de transações por sessão (via cookies)
- Middleware para validação de sessão
- TypeScript para segurança de tipos
- Knex.js para migrações e queries no banco de dados

---

## Tecnologias Utilizadas
- **Node.js**
- **Express**
- **TypeScript**
- **Knex.js** (query builder SQL)
- **SQLite** (banco de dados)
- **Vitest** (testes)

---

## Estrutura do Projeto
```
TransitionsAPI/
├── src/
│   ├── app.ts                  # Configuração do app Express
│   ├── server.ts               # Ponto de entrada do servidor
│   ├── database_config.ts      # Configuração do Knex
│   ├── @types/                 # Tipos TypeScript customizados
│   ├── env/                    # Configuração de ambiente
│   ├── middlewares/            # Middlewares do Express
│   └── routes/                 # Handlers das rotas da API
├── db/
│   └── migrations/             # Scripts de migração do banco
├── test/                       # Arquivos de teste
├── build/                      # Saída JS compilada
├── knexfile.ts                 # Configuração do Knex CLI
├── package.json                # Metadados e scripts do projeto
├── tsconfig.json               # Configuração do TypeScript
└── README.md                   # Documentação do projeto
```

---

## Rotas da API

### Transações
Todas as rotas são prefixadas com `/transactions`.

| Método | Endpoint                  | Descrição                                    |
|--------|---------------------------|-----------------------------------------------|
| GET    | `/transactions`           | Lista todas as transações da sessão           |
| GET    | `/transactions/:id`       | Busca uma transação específica pelo ID        |
| GET    | `/transactions/summary`   | Obtém um resumo (ex: saldo) da sessão         |
| POST   | `/transactions`           | Cria uma nova transação                       |

#### Gerenciamento de Sessão
- A API utiliza um ID de sessão armazenado em cookies para associar transações a uma sessão de usuário.
- Middleware garante que o ID de sessão exista para rotas protegidas.

---

## Banco de Dados
- Gerenciado com migrações do Knex.js (ver `db/migrations/`).
- Tabela principal: `transactions` (campos: id, title, amount, type, session_id, created_at).
- Migrações criam e atualizam o schema conforme necessário.

---

## Instalação e Configuração

1. **Clone o repositório:**
	```bash
	git clone https://github.com/GabrielVinicius1106/TransactionsAPI.git
	cd TransactionsAPI
	```
2. **Instale as dependências:**
	```bash
	npm install
	```
3. **Configure as variáveis de ambiente:**
	- Copie `.env.example` para `.env` e preencha com as credenciais do seu banco de dados.

4. **Execute as migrações do banco:**
	```bash
	npx knex migrate:latest --knexfile knexfile.ts
	```

---

## Executando o Projeto

- **Desenvolvimento:**
  ```bash
  npm run dev
  ```
- **Produção:**
  ```bash
  npm run build
  npm run start
  ```

---

## Testes

- Execute os testes com:
  ```bash
  npm run test
  ```

---

## Licença

Este projeto está licenciado sob a Licença MIT.
