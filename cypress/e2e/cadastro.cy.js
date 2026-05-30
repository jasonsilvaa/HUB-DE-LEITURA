/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import cadastroPage from '../support/pages/cadastro-page';
describe('Funcionalidade: Cadastro',()=>{
    beforeEach(()=>{
        cy.visit('/register.html')
    });
    it('Deve preencher o formulário de cadastro com sucesso',()=>{
        const name = 'João da Silva'
        const email = `joao${Math.floor(Math.random() * 1000)}@silva.com`
        const password = 'senha123'
        cy.get('#name').type(name)
        cy.get('#email').type(email)
        cy.get('#phone').type('11987654321')
        cy.get('#password').type(password)
        cy.get('#confirm-password').type(password)
        cy.get('#terms-agreement').check()
        cy.get('#register-btn').click()
        cy.url().should('include', 'dashboard.html')
    });
});
describe('Funcionalidade: Cadastro - Testes de validação com faker',()=>{
    beforeEach(()=>{
        cy.visit('/register.html')
    });
    it('Deve preencher o formulário de cadastro com sucesso usando dados do faker',()=>{
        const name = faker.person.fullName()
        const email = faker.internet.email()
        const phone = faker.phone.number('119########')
        const password = faker.internet.password({ length: 8 })
        cy.get('#name').type(name)
        cy.get('#email').type(email)
        cy.get('#phone').type(phone)
        cy.get('#password').type(password)
        cy.get('#confirm-password').type(password)
        cy.get('#terms-agreement').check()
        cy.get('#register-btn').click()
        cy.url().should('include', 'dashboard.html')
    });
});
describe('Funcionalidade: Cadastro - Testes de validação de campos com comando customizado',()=>{
    beforeEach(()=>{
        cy.visit('/register.html')
    });
    it('Deve preencher o formulário de cadastro com sucesso usando comando customizado',()=>{
        const name = faker.person.fullName()
        const email = faker.internet.email()
        const phone = faker.phone.number('119########')
        const password = faker.internet.password({ length: 8 })
        const confirmPassword = password

        cy.preencherFormularioCadastro(name, email, phone, password, confirmPassword)
    });
});
describe('Funcionalidade: Cadastro - Testes de validação de campos com página objeto',()=>{
    beforeEach(()=>{
       cadastroPage.visitarPaginacadastro()
    });
    it('Deve preencher o formulário de cadastro com sucesso usando página objeto',()=>{
        const name = faker.person.fullName()
        const email = faker.internet.email()
        const phone = faker.phone.number('119########')
        const password = faker.internet.password({ length: 8 })
        const confirmPassword = password

        cadastroPage.preencherCadastro(name, email, phone, password, confirmPassword)
    });
});

describe('Cadastro com usuário faker', () => {
    before(function () {
        this.user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number('119########'),
            password: faker.internet.password({ length: 8 })
        };
    });

    it('Deve cadastrar um usuário usando dados faker', function () {
        cy.visit('/register.html');
        cy.get('#name').type(this.user.name);
        cy.get('#email').type(this.user.email);
        cy.get('#phone').type(this.user.phone);
        cy.get('#password').type(this.user.password);
        cy.get('#confirm-password').type(this.user.password);
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.url().should('include', 'dashboard.html');
        cy.writeFile('cypress/fixtures/usuario-faker.json', this.user);
    });
});