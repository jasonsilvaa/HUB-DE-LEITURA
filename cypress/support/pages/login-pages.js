class loginPage{
    // Elementos
    campoEmail() {return cy.get('#email')}
    campoSenha() {return cy.get('#password')}
    botaoLogin() {return cy.get('#login-btn')}

    // Ações
    acessarLogin(){
        cy.visit('/login.html')
    }
    preencherLogin(email, password){
        this.campoEmail().type(email)
        this.campoSenha().type(password)
        this.botaoLogin().click()
    }

}
export default new loginPage()