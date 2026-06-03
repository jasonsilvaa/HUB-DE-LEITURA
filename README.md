# Hub de Leitura — Testes com Cypress

Suíte de testes automatizados para a aplicação **Hub de Leitura**, cobrindo fluxos de **UI** (cadastro, login, catálogo, contato) e **API** (CRUD de usuários).

> **Nota:** Este repositório contém apenas os testes. A aplicação deve estar em execução em `http://localhost:3000` antes de rodar os testes.

## Funcionalidades testadas

### UI — `cypress/e2e/UI/`

| Módulo | Arquivo | Descrição |
|--------|---------|-----------|
| Cadastro | `cadastro.cy.js` | Preenchimento e validação do formulário de registro |
| Login | `login.cy.js` | Autenticação com credenciais válidas |
| Catálogo | `catalogo.cy.js` | Adição de livros ao carrinho |
| Busca | `catalogo-busca.cy.js` | Pesquisa de livros no catálogo |
| Contato | `contato.cy.js` | Envio e validação do formulário de contato |
| E2E | `end-to-end.cy.js` | Fluxo completo de cadastro seguido de login |

### API — `cypress/e2e/API/`

| Módulo | Arquivo | Descrição |
|--------|---------|-----------|
| Usuários | `usuarios.cy.js` | GET, POST, PUT e DELETE em `/api/users` |

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/)
- Aplicação **Hub de Leitura** rodando em `http://localhost:3000`

## Instalação

```bash
git clone https://github.com/jasonsilvaa/HUB-DE-LEITURA.git
cd HUB-DE-LEITURA
npm install
```

## Executando os testes

Certifique-se de que a aplicação está disponível e, em seguida:

```bash
# Abrir o Cypress Test Runner (modo interativo)
npm run cy:open

# Executar todos os testes em modo headless
npm run cy:run

# Atalho equivalente a cy:run
npm test

# Executar apenas testes de UI
npm run cy:run -- --spec "cypress/e2e/UI/**/*.cy.js"

# Executar apenas testes de API
npm run cy:run -- --spec "cypress/e2e/API/**/*.cy.js"

# Executar um arquivo específico
npm run cy:run -- --spec "cypress/e2e/API/usuarios.cy.js"
```

## Lint

```bash
# Verificar problemas de código
npm run lint

# Corrigir automaticamente o que for possível
npm run lint:fix
```

## Estrutura do projeto

```
HUB-DE-LEITURA/
├── cypress/
│   ├── e2e/
│   │   ├── API/                    # Testes de API
│   │   │   └── usuarios.cy.js
│   │   └── UI/                     # Testes de interface
│   │       ├── cadastro.cy.js
│   │       ├── catalogo-busca.cy.js
│   │       ├── catalogo.cy.js
│   │       ├── contato.cy.js
│   │       ├── end-to-end.cy.js
│   │       └── login.cy.js
│   ├── fixtures/
│   │   ├── admin.json              # Credenciais do admin (API)
│   │   ├── livros.json
│   │   ├── usuario-faker.json
│   │   └── usuario.json
│   └── support/
│       ├── commands.js             # Comandos customizados (UI)
│       ├── commands/
│       │   └── api-commands.js     # Comandos customizados (API)
│       ├── e2e.js
│       └── pages/                  # Page Objects
│           ├── cadastro-page.js
│           └── login-pages.js
├── cypress.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## Padrões e boas práticas

### Page Object Model (POM)

Os seletores e ações de cada página ficam encapsulados em classes reutilizáveis:

- `cypress/support/pages/login-pages.js` — página de login
- `cypress/support/pages/cadastro-page.js` — página de cadastro

### Comandos customizados — UI

Definidos em `cypress/support/commands.js`:

| Comando | Descrição |
|---------|-----------|
| `cy.login(email, password)` | Preenche e submete o formulário de login |
| `cy.preencherFormularioCadastro(...)` | Preenche e submete o formulário de cadastro |
| `cy.preencherFormularioContato(...)` | Preenche e submete o formulário de contato |

### Comandos customizados — API

Definidos em `cypress/support/commands/api-commands.js`:

| Comando | Descrição |
|---------|-----------|
| `cy.apiLoginAdmin()` | Faz login como admin e salva o token em `Cypress.env('adminToken')` |
| `cy.listarUsuarios(qs?)` | GET `/api/users` com autenticação |
| `cy.buscarUsuarioPorId(id)` | GET `/api/users/:id` com autenticação |
| `cy.criarUsuario(user, options?)` | POST `/api/users` |
| `cy.atualizarUsuario(id, user, options?)` | PUT `/api/users/:id` com autenticação |
| `cy.deletarUsuario(id)` | DELETE `/api/users/:id` com autenticação |

#### Autenticação na API

O token é obtido dinamicamente no `before()` via `cy.apiLoginAdmin()` e armazenado em `Cypress.env('adminToken')`. Os commands autenticados injetam o header `Authorization` automaticamente.

Para testes que **esperam erro** (status 400, 401, etc.), passe `{ failOnStatusCode: false }` no segundo parâmetro:

```javascript
cy.criarUsuario({ name: 'Maria', email: 'duplicado@email.com', password: 'senha123' }, {
    failOnStatusCode: false,
}).then((response) => {
    expect(response.status).to.eq(400)
})
```

#### Exemplo de uso nos testes de API

```javascript
describe('Testes de API de usuários', () => {
    before(() => {
        cy.apiLoginAdmin()
    })

    it('Deve listar usuários', () => {
        cy.listarUsuarios().then((response) => {
            expect(response.status).to.eq(200)
        })
    })
})
```

### Fixtures

Dados de teste reutilizáveis em `cypress/fixtures/`:

| Arquivo | Uso |
|---------|-----|
| `admin.json` | Credenciais do administrador para login na API |
| `usuario.json` | Credenciais fixas para testes de login na UI |
| `livros.json` | Lista de livros para testes de busca no catálogo |
| `usuario-faker.json` | Usuário gerado dinamicamente durante a execução |

### Geração de dados com Faker

O pacote `@faker-js/faker` gera nomes, e-mails, telefones e senhas aleatórios, evitando conflitos entre execuções.

## Páginas e endpoints testados

### UI

| Página | URL |
|--------|-----|
| Início / Contato | `/index.html` |
| Login | `/login.html` |
| Cadastro | `/register.html` |
| Catálogo | `/catalog.html` |
| Dashboard | `/dashboard.html` |

### API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/login` | Autenticação |
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Buscar usuário por ID |
| POST | `/api/users` | Criar usuário |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Remover usuário |

Documentação interativa disponível em `http://localhost:3000/api-docs`.

## Tecnologias

- [Cypress](https://www.cypress.io/) — framework de testes E2E
- [cypress-plugin-api](https://github.com/filiphric/cypress-plugin-api) — UI visual para testes de API
- [@faker-js/faker](https://fakerjs.dev/) — geração de dados fictícios
- [ESLint](https://eslint.org/) + [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) — linting

## Configuração

A URL base dos testes de API está definida em `cypress.config.js`:

```js
e2e: {
  baseUrl: 'http://localhost:3000/api/',
}
```

Com essa configuração, os commands de API usam URLs relativas como `users` e `login`, que resolvem para `http://localhost:3000/api/users` e `http://localhost:3000/api/login`.

Para apontar a outro ambiente:

```bash
CYPRESS_baseUrl=http://localhost:8080/api/ npm run cy:run
```

## Licença

ISC
