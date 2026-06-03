/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
describe('Funcionalidade: Contato', () => {
  beforeEach(() => {
    cy.visit('/index.html')
  });
  it('Deve preencher formulário de contato com sucesso', () => {
    cy.get('[name="name"]').type('Maria')
    cy.get('[name="email"]').type('maria@examplle.com')
    cy.get('[name="subject"]').select('Sugestões')
    cy.get('[name="message"]').type('Gostaria de sugerir uma nova funcionalidade para o site.')
    cy.get('#btn-submit').click()
    cy.get('#alert-container').should('be.visible').and('contain', 'Contato enviado com sucesso!')
  });
  it('Deve exibir mensagem de erro ao enviar formulário de contato sem preencher o campo nome', () => {
    cy.get('[name="email"]').type('maria@examplle.com')
    cy.get('[name="subject"]').select('Sugestões')
    cy.get('[name="message"]').type('Gostaria de sugerir uma nova funcionalidade para o site.')
    cy.get('#btn-submit').click()
    cy.get('#alert-container').should('be.visible').and('contain', 'Por favor, preencha o campo Nome.')
  });
  it('Deve exibir mensagem de erro ao enviar formulário de contato sem preencher o campo email', () => {
    cy.get('[name="name"]').type('Maria')
    cy.get('[name="subject"]').select('Sugestões')
    cy.get('[name="message"]').type('Gostaria de sugerir uma nova funcionalidade para o site.')
    cy.get('#btn-submit').click()
    cy.get('#alert-container').should('be.visible').and('contain', 'Por favor, preencha o campo E-mail.')
  });
  it('Deve exibir mensagem de erro ao enviar formulário de contato sem preencher o campo mensagem', () => {
    cy.get('[name="name"]').type('Maria')
    cy.get('[name="email"]').type('maria@examplle.com')
    cy.get('[name="subject"]').select('Sugestões')
    //cy.get('[name="message"]').type('Gostaria de sugerir uma nova funcionalidade para o site.')
    cy.get('#btn-submit').click()
    cy.get('#alert-container').should('be.visible').and('contain', 'Por favor, escreva sua Mensagem.')
  });
});
describe('Funcionalidade: Contato - Testes de validação com faker', () => {
  beforeEach(() => {
    cy.visit('/index.html')
  })
  it('Deve preencher formulário de contato com sucesso usando dados do faker', () => {
    const nome = faker.person.fullName()
    const email = faker.internet.email()
    const mensagem = faker.lorem.paragraph()
    cy.get('[name="name"]').type(nome)
    cy.get('[name="email"]').type(email)
    cy.get('[name="subject"]').select('Sugestões')
    cy.get('[name="message"]').type(mensagem)
    cy.get('#btn-submit').click()
    cy.get('#alert-container').should('be.visible').and('contain', 'Contato enviado com sucesso!')
  });
});
describe('Funcionalidade: Contato - Testes de validação de campos com comando customizado', () => {
  beforeEach(() => {
    cy.visit('/index.html')
  })
  it('Deve preencher formulário de contato com sucesso usando comando customizado', () => {
    const nome = faker.person.fullName()
    const email = faker.internet.email()
    const assunto = 'Sugestões'
    const mensagem = faker.lorem.paragraph()

    cy.preencherFormularioContato(nome, email, assunto, mensagem)
    cy.get('#alert-container').should('be.visible').and('contain', 'Contato enviado com sucesso!')
  });
});