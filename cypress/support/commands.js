// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#login-btn').click()
});
Cypress.Commands.add('preencherFormularioContato', (nome, email, assunto, mensagem) => {
    cy.get('[name="name"]').type(nome)
    cy.get('[name="email"]').type(email)
    cy.get('[name="subject"]').select(assunto)
    cy.get('[name="message"]').type(mensagem)
    cy.get('#btn-submit').click()
});
// backward-compatible alias for original (typo) command name
Cypress.Commands.add('preeencherFormularioContato', (nome, email, assunto, mensagem) => {
    cy.preencherFormularioContato(nome, email, assunto, mensagem)
});
Cypress.Commands.add('preencherFormularioCadastro', (name, email, phone, password, confirmPassword, termsAgreement, registerBtn) => { 
    cy.get('#name').type(name)
    cy.get('#email').type(email)
    cy.get('#phone').type(phone)
    cy.get('#password').type(password)
    cy.get('#confirm-password').type(confirmPassword)
    cy.get('#terms-agreement').check()
    cy.get('#register-btn').click()
});
// backward-compatible alias for original command name
Cypress.Commands.add('preencherformularioCadastro', (name, email, phone, password, confirmPassword, termsAgreement, registerBtn) => {
    cy.preencherFormularioCadastro(name, email, phone, password, confirmPassword, termsAgreement, registerBtn)
});