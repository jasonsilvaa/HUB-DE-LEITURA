pipeline {
    agent any

    parameters {
        string(
            name: 'APP_REPO_URL',
            defaultValue: 'https://github.com/jasonsilvaa/hub-de-leitura-api.git',
            description: 'Repositório da API Hub de Leitura'
        )
        string(
            name: 'APP_BASE_URL',
            defaultValue: 'http://localhost:3000',
            description: 'URL base da aplicação (sem /api)'
        )
    }

    environment {
        CI = 'true'
        APP_DIR = 'hub-de-leitura-api'
        CYPRESS_baseUrl = "${params.APP_BASE_URL}/api/"
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${env.PATH}"
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
                echo "Repositório da aplicação: ${params.APP_REPO_URL}"
                echo "URL da aplicação: ${params.APP_BASE_URL}"

                sh '''
                    . ./scripts/jenkins-setup.sh
                    echo "CYPRESS_baseUrl: $CYPRESS_baseUrl"
                '''
            }
        }

        stage('Instalação das Dependências dos Testes') {
            steps {
                sh '''
                    . ./scripts/jenkins-setup.sh

                    if [ -f package-lock.json ]; then
                        npm ci
                    else
                        npm install
                    fi
                    npx cypress verify
                '''
            }
        }

        stage('Subir API Hub de Leitura') {
            steps {
                sh '''
                    . ./scripts/jenkins-setup.sh
                    set -e

                    if [ -d "$APP_DIR" ]; then
                        rm -rf "$APP_DIR"
                    fi

                    git clone --depth 1 "${APP_REPO_URL}" "$APP_DIR"
                    cd "$APP_DIR"

                    npm install
                    npm run db

                    nohup npm start > ../app-server.log 2>&1 &
                    echo $! > ../app-server.pid

                    cd ..

                    echo "Aguardando aplicação em ${APP_BASE_URL}..."
                    for i in $(seq 1 30); do
                        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${APP_BASE_URL}/api/health" || true)
                        if [ "$HTTP_CODE" = "200" ]; then
                            echo "Aplicação disponível em ${APP_BASE_URL}/api/health"
                            exit 0
                        fi
                        sleep 2
                    done

                    echo "Falha ao iniciar a aplicação. Log:"
                    cat app-server.log || true
                    exit 1
                '''
            }
        }

        stage('Análise de Código (Lint)') {
            steps {
                sh '''
                    . ./scripts/jenkins-setup.sh
                    npm run lint
                '''
            }
        }

        stage('Execução dos Testes Automatizados') {
            steps {
                sh '''
                    . ./scripts/jenkins-setup.sh
                    npm run ci:test
                '''
            }
        }
    }

    post {
        always {
            sh '''
                if [ -f app-server.pid ]; then
                    kill "$(cat app-server.pid)" 2>/dev/null || true
                    rm -f app-server.pid
                fi
            '''
            archiveArtifacts(
                artifacts: 'cypress/screenshots/**/*,cypress/videos/**/*,app-server.log',
                allowEmptyArchive: true,
                onlyIfSuccessful: false
            )
        }
        success {
            echo 'Pipeline executado com sucesso!'
        }
        failure {
            echo 'Pipeline falhou. Verifique os logs e os artefatos (screenshots/vídeos/app-server.log).'
        }
    }
}
