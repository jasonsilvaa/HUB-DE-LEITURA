pipeline {
    agent any

    parameters {
        string(
            name: 'APP_BASE_URL',
            defaultValue: 'http://localhost:3000',
            description: 'URL base da aplicação Hub de Leitura (sem /api)'
        )
    }

    environment {
        CI = 'true'
        CYPRESS_baseUrl = "${params.APP_BASE_URL}/api/"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Preparação do Ambiente') {
            steps {
                echo 'Iniciando pipeline de testes automatizados — Hub de Leitura'
                echo "Branch: ${env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'N/A'}"
                echo "Commit: ${env.GIT_COMMIT ?: 'N/A'}"
                echo "URL da aplicação: ${params.APP_BASE_URL}"

                sh '''
                    echo "Node: $(node --version)"
                    echo "npm: $(npm --version)"
                    echo "CYPRESS_baseUrl: $CYPRESS_baseUrl"
                '''
            }
        }

        stage('Instalação das Dependências') {
            steps {
                sh '''
                    if [ -f package-lock.json ]; then
                        npm ci
                    else
                        npm install
                    fi
                    npx cypress verify
                '''
            }
        }

        stage('Análise de Código (Lint)') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Verificar Disponibilidade da Aplicação') {
            steps {
                sh '''
                    set +e
                    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${APP_BASE_URL}/api/health")
                    if [ "$HTTP_CODE" = "200" ]; then
                        echo "Aplicação disponível em ${APP_BASE_URL}/api/health"
                        exit 0
                    fi

                    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${APP_BASE_URL}/api-docs")
                    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
                        echo "Aplicação disponível em ${APP_BASE_URL}/api-docs"
                        exit 0
                    fi

                    echo "AVISO: Aplicação não respondeu em ${APP_BASE_URL}."
                    echo "Os testes podem falhar se o Hub de Leitura não estiver em execução."
                    exit 0
                '''
            }
        }

        stage('Execução dos Testes Automatizados') {
            steps {
                sh 'npm run ci:test'
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'cypress/screenshots/**/*,cypress/videos/**/*',
                allowEmptyArchive: true,
                onlyIfSuccessful: false
            )
        }
        success {
            echo 'Pipeline executado com sucesso!'
        }
        failure {
            echo 'Pipeline falhou. Verifique os logs e os artefatos (screenshots/vídeos).'
        }
    }
}
