# Hub de Leitura — Testes E2E com Cypress

Suíte de testes end-to-end automatizados para a aplicação **Hub de Leitura**, uma plataforma web de catálogo e gestão de livros. Os testes cobrem fluxos de cadastro, login, catálogo, busca e formulário de contato.

> **Nota:** Este repositório contém apenas os testes automatizados. A aplicação web deve estar em execução em `http://localhost:3000` antes de rodar os testes.

## Funcionalidades testadas

| Módulo | Arquivo | Descrição |
|--------|---------|-----------|
| Cadastro | `cypress/e2e/cadastro.cy.js` | Preenchimento e validação do formulário de registro |
| Login | `cypress/e2e/login.cy.js` | Autenticação com credenciais válidas |
| Catálogo | `cypress/e2e/catalogo.cy.js` | Adição de livros ao carrinho |
| Busca | `cypress/e2e/catalogo-busca.cy.js` | Pesquisa de livros no catálogo |
| Contato | `cypress/e2e/contato.cy.js` | Envio e validação do formulário de contato |
| E2E | `cypress/e2e/end-to-end.cy.js` | Fluxo completo de cadastro seguido de login |

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/)
- Aplicação **Hub de Leitura** rodando em `http://localhost:3000`

## Instalação

```bash
git clone <url-do-repositorio>
cd HUB-DE-LEITURA
npm install
```

## Executando os testes

Certifique-se de que a aplicação está disponível em `http://localhost:3000` e, em seguida:

```bash
# Abrir o Cypress Test Runner (modo interativo)
npm run cy:open

# Executar todos os testes em modo headless
npm run cy:run

# Atalho equivalente a cy:run
npm test

# Executar um arquivo específico
npm run cy:run -- --spec "cypress/e2e/login.cy.js"
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
│   ├── e2e/                    # Specs de teste
│   │   ├── cadastro.cy.js
│   │   ├── catalogo-busca.cy.js
│   │   ├── catalogo.cy.js
│   │   ├── contato.cy.js
│   │   ├── end-to-end.cy.js
│   │   └── login.cy.js
│   ├── fixtures/               # Dados estáticos para os testes
│   │   ├── livros.json
│   │   ├── usuario-faker.json
│   │   └── usuario.json
│   └── support/
│       ├── commands.js         # Comandos customizados
│       ├── e2e.js              # Configuração global do Cypress
│       └── pages/              # Page Objects
│           ├── cadastro-page.js
│           └── login-pages.js
├── cypress.config.js           # Configuração do Cypress
├── package.json
└── README.md
```

## Padrões e boas práticas

### Page Object Model (POM)

Os seletores e ações de cada página ficam encapsulados em classes reutilizáveis:

- `cypress/support/pages/login-pages.js` — página de login
- `cypress/support/pages/cadastro-page.js` — página de cadastro

### Comandos customizados

Definidos em `cypress/support/commands.js`:

| Comando | Descrição |
|---------|-----------|
| `cy.login(email, password)` | Preenche e submete o formulário de login |
| `cy.preencherFormularioCadastro(...)` | Preenche e submete o formulário de cadastro |
| `cy.preencherFormularioContato(...)` | Preenche e submete o formulário de contato |

### Fixtures

Dados de teste reutilizáveis em `cypress/fixtures/`:

- `usuario.json` — credenciais fixas para login
- `livros.json` — lista de livros para testes de busca no catálogo
- `usuario-faker.json` — usuário gerado dinamicamente (criado durante a execução dos testes)

### Geração de dados com Faker

O pacote `@faker-js/faker` gera nomes, e-mails, telefones e senhas aleatórios, evitando conflitos entre execuções e permitindo testes mais realistas.

## Páginas da aplicação testadas

| Página | URL |
|--------|-----|
| Início / Contato | `/index.html` |
| Login | `/login.html` |
| Cadastro | `/register.html` |
| Catálogo | `/catalog.html` |
| Dashboard | `/dashboard.html` |

## Tecnologias

- [Cypress](https://www.cypress.io/) — framework de testes E2E
- [@faker-js/faker](https://fakerjs.dev/) — geração de dados fictícios

## Configuração

A URL base da aplicação está definida em `cypress.config.js`:

```js
e2e: {
  baseUrl: 'http://localhost:3000',
}
```

Para apontar os testes a outro ambiente, altere o valor de `baseUrl` ou passe a variável de ambiente `CYPRESS_baseUrl` na execução:

```bash
CYPRESS_baseUrl=http://localhost:8080 npm run cy:run
```

## Licença

ISC
