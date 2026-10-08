pipeline {
    agent any

    environment {
        IMAGE_NAME            = 'task-tracker'
        CONTAINER_NAME        = 'task-tracker'
        APP_PORT              = '4000'
        UI_TEST_PORT          = '4001'
        JEST_JUNIT_OUTPUT_DIR = 'reports'
    }

    triggers {
        // Checks Git every ~2 minutes. Works on a local Jenkins with no webhook setup.
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Unit Test') {
            steps {
                withEnv(['JEST_JUNIT_OUTPUT_NAME=unit.xml']) {
                    bat 'npx jest tests/unit.test.js --reporters=default --reporters=jest-junit'
                }
            }
        }

        stage('UI Test') {
            steps {
                // Start the app on a separate port so it doesn't clash with the deployed one
                withEnv(['PORT=4001', 'BASE_URL=http://localhost:4001', 'JEST_JUNIT_OUTPUT_NAME=ui.xml']) {
                    bat '''
                        start "ui-app" /B cmd /c "node src/server.js > app-ui.log 2>&1"
                        ping -n 6 127.0.0.1 > nul
                        npx jest tests/ui.test.js --testTimeout=30000 --reporters=default --reporters=jest-junit
                    '''
                }
            }
            post {
                always {
                    // Stop whatever is listening on the UI test port
                    powershell '''
                        Get-NetTCPConnection -LocalPort 4001 -ErrorAction SilentlyContinue |
                          ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
                    '''
                }
            }
        }

        stage('Build Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Deploy') {
            steps {
                bat '''
                    docker rm -f %CONTAINER_NAME% || cmd /c "exit 0"
                    docker run -d --name %CONTAINER_NAME% -p %APP_PORT%:4000 --restart unless-stopped %IMAGE_NAME%:latest
                '''
            }
        }
    }

    post {
        always {
            // Publishes test results so Jenkins graphs pass/fail over time
            junit allowEmptyResults: true, testResults: 'reports/*.xml'
        }
    }
}