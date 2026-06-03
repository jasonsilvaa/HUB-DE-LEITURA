const DEFAULT_ADMIN = {
    email: 'admin@biblioteca.com',
    password: 'admin123',
}

const FALLBACK_ADMIN = {
    email: 'admin@updated.com',
    password: 'senha123',
}

const getAuthHeaders = () => {
    const token = Cypress.env('adminToken')

    if (!token) {
        throw new Error('Token admin não encontrado. Execute cy.apiLoginAdmin() antes dos testes autenticados.')
    }

    return { Authorization: token }
}

const loginRequest = (credentials) => {
    return cy.api({
        method: 'POST',
        url: 'login',
        body: credentials,
        failOnStatusCode: false,
    })
}

const saveAdminToken = (response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('token')
    Cypress.env('adminToken', response.body.token)
    return response.body.token
}

Cypress.Commands.add('apiLoginAdmin', () => {
    return loginRequest(DEFAULT_ADMIN).then((response) => {
        if (response.status === 200) {
            return saveAdminToken(response)
        }

        return loginRequest(FALLBACK_ADMIN).then((fallbackResponse) => {
                const token = saveAdminToken(fallbackResponse)

                return cy.api({
                    method: 'PUT',
                    url: 'users/1',
                    headers: { Authorization: token },
                    body: DEFAULT_ADMIN,
                }).then(() => loginRequest(DEFAULT_ADMIN)).then(saveAdminToken)
            })
    })
})

Cypress.Commands.add('listarUsuarios', (qs = {}) => {
    return cy.api({
        method: 'GET',
        url: 'users',
        headers: getAuthHeaders(),
        qs,
    })
})

Cypress.Commands.add('buscarUsuarioPorId', (id) => {
    return cy.api({
        method: 'GET',
        url: `users/${id}`,
        headers: getAuthHeaders(),
    })
})

Cypress.Commands.add('criarUsuario', (user, options = {}) => {
    const { failOnStatusCode = true } = options

    return cy.api({
        method: 'POST',
        url: 'users',
        body: user,
        failOnStatusCode,
    })
})

Cypress.Commands.add('atualizarUsuario', (id, user, options = {}) => {
    const { failOnStatusCode = true } = options

    return cy.api({
        method: 'PUT',
        url: `users/${id}`,
        headers: getAuthHeaders(),
        body: user,
        failOnStatusCode,
    })
})

Cypress.Commands.add('deletarUsuario', (id) => {
    return cy.api({
        method: 'DELETE',
        url: `users/${id}`,
        headers: getAuthHeaders(),
    })
})