class cadastroPage {
     
    // Seletores
    campoNome() {return cy.get('#name')}
    campoEmail() {return cy.get('#email')}
    campoPhone() {return cy.get('#phone')}
    campoSenha() {return cy.get('#password')}
    campoConfirmarSenha() {return cy.get('#confirm-password')}
    checkboxTermos() {return cy.get('#terms-agreement')}
    botaoRegistrar() {return cy.get('#register-btn')}

    // Métodos
    visitarPaginacadastro() {
        cy.visit('/register.html')
    }
    preencherCadastro(name, email, phone, password, confirmPassword) {
        this.campoNome().type(name)
        this.campoEmail().type(email)
        this.campoPhone().type(phone)
        this.campoSenha().type(password)
        this.campoConfirmarSenha().type(confirmPassword)
        this.checkboxTermos().check()
        this.botaoRegistrar().click()
    }

};

export default new cadastroPage();