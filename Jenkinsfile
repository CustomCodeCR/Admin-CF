pipeline {
    agent any

    stages {
        stage('Docker Build') {
            steps {
                script {
                    bat "docker build -t maulang18/admin.cf:latest ."
                }
            }
        }
        stage('Docker Run (Development)') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' }
            }
            steps {
                script {
                    // Detener y eliminar el contenedor AdminCFDev si existe
                    bat 'docker stop AdminCFDev 2>NUL || exit 0'
                    bat 'docker rm AdminCFDev 2>NUL || exit 0'
                    
                    // Ejecutar el contenedor de desarrollo
                    bat 'docker run -d -p 10109:80 --name AdminCFDev maulang18/admin.cf:latest'
                }
            }
        }
        stage('Docker Compose Up (Production)') {
            when {
                expression { env.GIT_BRANCH == 'origin/master' }
            }
            steps {
                script {
                    // Detener y eliminar el contenedor AdminCFDev si existe
                    bat 'docker stop AdminCFDev 2>NUL || exit 0'
                    bat 'docker rm AdminCFDev 2>NUL || exit 0'
                    
                    // Ejecutar docker-compose para producción
                    dir('C:/Users/administrador/Desktop/Docker/CastroFallas') {
                        bat 'docker-compose up -d'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Limpieza después de cada ejecución
                bat 'docker system prune -af'
            }
        }

        success {
            script {
                echo 'Pipeline succeeded!'
            }
        }

        failure {
            script {
                echo 'Pipeline failed!'
            }
        }
    }
}
