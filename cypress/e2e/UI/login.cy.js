/// <reference types="cypress" />
import user from '../../fixtures/usuario.json'
import loginPage from '../../support/pages/login-pages';
import { faker } from '@faker-js/faker';
describe('Funcionalidade: Login', () => {
  beforeEach(() => {
    cy.visit('/login.html')
  });
  it('Deve realizar login com sucesso', () => {
    const email = 'joao@silva.com'
    const password = 'senha123'
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#login-btn').click()
    cy.url().should('include', 'dashboard.html')
  });
});
describe('Funcionalidade: Login - Testes de validação com comando customizado', () => {
    beforeEach(() => {  
        cy.visit('/login.html')
    });
    it('Deve realizar login com sucesso usando comando customizado', () => {
        cy.login('joao@silva.com', 'senha123')
        cy.url().should('include', 'dashboard.html')
    });
});
describe('Funcionalidade: Login - Testes de validação usando fixture', () => {
    beforeEach(() => {  
        cy.visit('/login.html')
    });
    it('Deve realizar login com sucesso usando dados da fixture', () => {
        cy.login(user.email, user.password)
        cy.url().should('include', 'dashboard.html')
    });
});
describe('Funcionalidade: Login - Teste com página objeto', () => {
    beforeEach(() => {  
        loginPage.acessarLogin()
    });
    it('Deve realizar login com sucesso usando página objeto', () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 8 })
        loginPage.preencherLogin(email, password)
        cy.url().should('include', 'dashboard.html')
    });
});

describe('Login com usuário cadastrado via faker', () => {
    before(function () {
        cy.readFile('cypress/fixtures/usuario-faker.json', { failOnNonExist: false })
            .then((user) => {
                if (user && user.email && user.password) {
                    return user;
                }

                const newUser = {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    phone: faker.phone.number('119########'),
                    password: faker.internet.password({ length: 8 })
                };

                cy.visit('/register.html');
                cy.get('#name').type(newUser.name);
                cy.get('#email').type(newUser.email);
                cy.get('#phone').type(newUser.phone);
                cy.get('#password').type(newUser.password);
                cy.get('#confirm-password').type(newUser.password);
                cy.get('#terms-agreement').check();
                cy.get('#register-btn').click();
                cy.url().should('include', 'dashboard.html');
                cy.writeFile('cypress/fixtures/usuario-faker.json', newUser);
                return newUser;
            })
            .then((user) => {
                this.user = user;
            });
    });

    beforeEach(() => {
        cy.visit('/login.html');
    });

    it('Deve fazer login com o usuário criado no cadastro', function () {
        cy.login(this.user.email, this.user.password);
        cy.url().should('include', 'dashboard.html');
    });
});
describe('Funcionalidade: Login - Teste de login com pagina objeto e dados do faker', () => {
    beforeEach(() => {  
        loginPage.acessarLogin()
    });
    it('Deve realizar login com sucesso usando página objeto e dados do faker', () => {
        cy.fixture('usuario-faker').then((user) => {
            loginPage.preencherLogin(user.email, user.password)
            cy.url().should('include', 'dashboard.html')
        })
    });
});

