# Hub de Leitura — Testes com Cypress

Suíte de testes automatizados para a aplicação **Hub de Leitura**, cobrindo fluxos de **UI** (cadastro, login, catálogo, contato) e **API** (CRUD de usuários).

> **Nota:** Este repositório contém apenas os testes. A aplicação ([hub-de-leitura-integrado](https://github.com/jasonsilvaa/hub-de-leitura-integrado)) deve estar em execução em `http://localhost:3000` antes de rodar os testes localmente. No Jenkins, a aplicação é clonada e iniciada automaticamente pelo pipeline.

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
- Aplicação **Hub de Leitura** rodando em `http://localhost:3000` ([hub-de-leitura-integrado](https://github.com/jasonsilvaa/hub-de-leitura-integrado))

## Instalação

### 1. Subir a aplicação (em outro terminal)

```bash
git clone https://github.com/jasonsilvaa/hub-de-leitura-integrado.git
cd hub-de-leitura-integrado
npm install
npm run db
npm start
```

### 2. Instalar os testes

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
├── Jenkinsfile                 # Pipeline de Integração Contínua
├── scripts/
│   └── jenkins-setup.sh        # Configura PATH do Node.js no Jenkins
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

## Integração Contínua — Jenkins

O projeto inclui um `Jenkinsfile` com pipeline declarativo para execução automática dos testes.

### Pré-requisitos no Jenkins

- [Jenkins](https://www.jenkins.io/) instalado localmente ou em servidor acessível
- Plugin **Pipeline** habilitado
- **Node.js** (v18+) e **npm** disponíveis no agente (PATH)
- **Git** disponível no agente (para clonar a aplicação)

A aplicação é obtida automaticamente do repositório [hub-de-leitura-integrado](https://github.com/jasonsilvaa/hub-de-leitura-integrado) — não é necessário subir o servidor manualmente antes do build.

### Estágios do pipeline

| Estágio | Descrição |
|---------|-----------|
| Preparação do Ambiente | Exibe versões do Node/npm e variáveis do build |
| Instalação das Dependências dos Testes | `npm ci` + `cypress verify` |
| Subir Aplicação Hub de Leitura | Clona `hub-de-leitura-integrado`, `npm install`, `npm run db`, `npm start` |
| Análise de Código (Lint) | `npm run lint` |
| Execução dos Testes Automatizados | `npm run ci:test` (testes de API) |

### Configurar o job no Jenkins

1. Acesse Jenkins → **New Item** → **Pipeline**
2. Em **Pipeline** → **Definition**: *Pipeline script from SCM*
3. **SCM**: Git
4. **Repository URL**: `https://github.com/jasonsilvaa/HUB-DE-LEITURA.git`
5. **Branches to build** → **Branch Specifier**: `*/main` (não use `master`)
6. **Script Path**: `Jenkinsfile`
7. Salve e clique em **Build Now**

### Erro: `couldn't find remote ref refs/heads/master`

O repositório usa a branch **`main`**, não `master`. No job do Jenkins:

1. **Configure** → seção **Pipeline** → **Branches to build**
2. Altere de `*/master` para **`*/main`**
3. Salve e execute **Build Now** novamente

### Erro: `node: command not found` / `npm: command not found`

O Jenkins roda com um PATH limitado e não encontra o Node.js automaticamente. O pipeline já inclui `scripts/jenkins-setup.sh` com os caminhos do Homebrew (`/opt/homebrew/bin`).

Se o erro persistir:

1. Instale o Node.js: https://nodejs.org/ (v18+)
2. Ou instale o plugin **NodeJS** no Jenkins e configure uma instalação global
3. Reinicie o Jenkins após instalar o Node.js
4. Execute **Build Now** novamente

### Parâmetros do pipeline

| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `APP_REPO_URL` | `https://github.com/jasonsilvaa/hub-de-leitura-integrado.git` | Repositório da aplicação |
| `APP_BASE_URL` | `http://localhost:3000` | URL da aplicação sob teste |

### Execução local (simulando CI)

```bash
# Terminal 1 — aplicação
git clone https://github.com/jasonsilvaa/hub-de-leitura-integrado.git
cd hub-de-leitura-integrado && npm install && npm run db && npm start

# Terminal 2 — testes
cd HUB-DE-LEITURA
npm ci
npm run lint
npm run ci:test
```

### Webhook GitHub (opcional)

Para executar o pipeline a cada push:

1. Jenkins → job → **Configure** → **Build Triggers** → **GitHub hook trigger**
2. No GitHub: repositório → **Settings** → **Webhooks** → adicione a URL do Jenkins

## Licença

ISC
