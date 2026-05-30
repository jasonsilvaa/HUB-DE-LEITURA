/// <reference types="cypress" />
describe('Funcionalidade: Catalogo', () => {
  beforeEach(() => {
    cy.visit('/catalog.html')
  });
  it('Deve adicionar um produto ao carrinho', () => {
   cy.get(':nth-child(1) > .card > .card-body > .mt-auto > .d-grid > .btn-primary').click()
    cy.get('#cart-count').should('contain', 1)
  });
  it('Deve remover um produto do carrinho pegando primeiro elemento', () => {
    cy.get('.btn-primary').first().click()
    cy.get('#cart-count').should('contain', 1)
  });
  it('Deve selenionar todos os produtos e adicionar ao carrinho', () => {
    cy.get('.btn-primary').click({ multiple: true })
  });
  it('Deve adicionar o úlimo produto ao carrinho', () => {
    cy.get('.btn-primary').last().click()
    cy.get('#cart-count').should('contain', 1)
  } );
});