/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import cadastroPage from '../support/pages/cadastro-page';
import loginPage from '../support/pages/login-pages';

describe('E2E - Cadastro e Login no Hub de Leitura', () => {
  it('Deve cadastrar um usuário válido e em seguida fazer login com ele', () => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('119########'),
      password: faker.internet.password({ length: 10 })
    };

    cadastroPage.visitarPaginacadastro();
    cy.location('hostname').should('equal', 'localhost');
    cy.location('port').should('equal', '3000');
    cy.location('pathname').should('include', '/register.html');

    cy.preencherFormularioCadastro(
      user.name,
      user.email,
      user.phone,
      user.password,
      user.password
    );

    cy.url().should('include', 'dashboard.html');

    loginPage.acessarLogin();
    cy.location('pathname').should('include', '/login.html');

    loginPage.preencherLogin(user.email, user.password);
    cy.url().should('include', 'dashboard.html');
  });
});
