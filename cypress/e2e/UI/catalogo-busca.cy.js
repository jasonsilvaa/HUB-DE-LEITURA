/// <reference types="cypress" />
import livros from '../../fixtures/livros.json'
describe('Funcionalidade: Catalogo', () => {
  beforeEach(() => {
    cy.visit('/catalog.html')
  });
  it('Deve buscar um produto específico e verificar se ele está presente no catálogo', () => {
    const produto = '1984'
    cy.get('#search-input').type(produto)
    cy.get('.card').contains('.card-title', produto).should('be.visible')
  });
});
describe('Deve buscar livros no catálogo e verificar se os resultados correspondem à busca', () => {
  beforeEach(() => {
    cy.visit('/catalog.html')
  });
  it('Deve buscar um livro específico e verificar se ele está presente no catálogo', () => {
    livros.forEach((livro) => {
      cy.get('#search-input').clear()
      cy.get('#search-input').type(livro.title)
      cy.get('.card').contains('.card-title', livro.title).should('be.visible')
    });
  });
  it('Deve realizar busca por livro usando fixture e verificar os resultados', () => {
    cy.fixture('livros').then((livros) => {
      livros.forEach((livro) => {
        cy.get('#search-input').clear()
        cy.get('#search-input').type(livro.title)
        cy.get('.card').contains('.card-title', livro.title).should('be.visible')
      });
    });
  });
});
