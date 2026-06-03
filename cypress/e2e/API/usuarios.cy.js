/// <reference types="cypress" />

describe('Testes de API de usuários', () => {
    before(() => {
        cy.apiLoginAdmin()
    })

    describe('GET - usuários', () => {
        it('Deve listar usuários', () => {
            cy.listarUsuarios().then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('users')
                expect(response.body.users).to.be.an('array').and.not.be.empty
                expect(response.body).to.have.property('pagination')
            })
        })

        it('Deve listar a propriedade de um usuário com ID', () => {
            cy.buscarUsuarioPorId(1).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('id')
                expect(response.body).to.have.property('name')
                expect(response.body).to.have.property('email')
            })
        })

        it('Deve listar usuário com sucesso usando filtros - parâmetros de busca', () => {
            cy.listarUsuarios({ page: 1, limit: 20, search: 'Admin' }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('users')
                expect(response.body.users).to.be.an('array')
                expect(response.body).to.have.property('pagination')
            })
        })
    })

    describe('POST - usuários', () => {
        it('Deve criar usuário com sucesso', () => {
            const email = `maria.${Date.now()}@email.com`

            cy.criarUsuario({
                name: 'Maria Santos',
                email,
                password: 'senha123',
            }).then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body).to.have.property('message')
                expect(response.body).to.have.property('user')
                expect(response.body.user).to.have.property('id')
                expect(response.body.user).to.have.property('name', 'Maria Santos')
                expect(response.body.user).to.have.property('email', email)
                expect(response.body.user).to.not.have.property('password')
                expect(response.body.message).to.eq('Usuário criado com sucesso.')
            })
        })

        it('Deve retornar erro ao criar usuário com email já existente', () => {
            cy.criarUsuario({
                name: 'Maria Santos',
                email: 'maria@email.com',
                password: 'senha123',
            }, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.eq('Email já está sendo usado por outro usuário.')
            })
        })

        it('Deve retornar erro ao criar usuário sem senha', () => {
            cy.criarUsuario({
                name: 'Maria Santos',
                email: 'mariaemail.com',
            }, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.eq('Nome, email e senha são obrigatórios.')
            })
        })

        it('Deve retornar erro ao criar usuário com email inválido', () => {
            cy.criarUsuario({
                name: 'Maria Santos',
                email: 'mariaemail.com',
                password: 'senha123',
            }, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.eq('Formato de email inválido.')
            })
        })
    })

    describe('PUT - Gerenciar usuários', () => {
        let userId

        before(() => {
            const email = `put.${Date.now()}@email.com`

            cy.criarUsuario({
                name: 'Usuario PUT Test',
                email,
                password: 'senha123',
            }).then((response) => {
                userId = response.body.user.id
            })
        })

        it('Deve atualizar usuário com sucesso', () => {
            cy.atualizarUsuario(userId, {
                name: 'Nome Atualizado',
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.eq('Usuário atualizado com sucesso.')
                expect(response.body).to.have.property('user')
                expect(response.body.user).to.have.property('name', 'Nome Atualizado')
            })
        })

        it('Deve alterar o email do usuário com sucesso', () => {
            const newEmail = `updated.${Date.now()}@email.com`

            cy.atualizarUsuario(userId, {
                email: newEmail,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.eq('Usuário atualizado com sucesso.')
                expect(response.body.user).to.have.property('email', newEmail)
            })
        })

        it('Deve alterar a senha do usuário com sucesso', () => {
            cy.atualizarUsuario(userId, {
                password: 'novaSenha123',
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.eq('Usuário atualizado com sucesso.')
            })
        })

        it('Deve alterar usuário com sucesso e validar busca por id', () => {
            const newName = `Usuario Validado ${Date.now()}`

            cy.atualizarUsuario(userId, {
                name: newName,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Usuário atualizado com sucesso.')
            })

            cy.buscarUsuarioPorId(userId).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('name', newName)
            })
        })
    })
    describe('DELETE - Gerenciar usuários', () => {
        it('Deve deletar usuário com sucesso', () => {
            cy.deletarUsuario(8).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('message')
                expect(response.body.message).to.eq('Usuário removido com sucesso.')
            })
        })
    })
})
