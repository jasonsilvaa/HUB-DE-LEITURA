const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // cypress-plugin-api ainda usa Cypress.env() internamente (hideCredentials, etc.)
  allowCypressEnv: true,

  e2e: {
    baseUrl: 'http://localhost:3000/api/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
