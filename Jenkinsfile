pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'maulang18/admin.cf:latest'
        CONTAINER_NAME_DEV = 'AdminCFDev'
        PORT_DEV = '10109'
        PROJECT_PATH = '/ruta/a/tu/proyecto'
        PORT_CONTAINER = '80'
        COMPOSE_NAME = 'docker-compose-castrofallas.yml'
    }

    stages {
        stage('Docker Build') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }
        stage('Docker Run (Development)') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' }
            }
            steps {
                script {
                    // Detener y eliminar el contenedor de desarrollo si existe
                    sh "docker stop ${CONTAINER_NAME_DEV} || true"
                    sh "docker rm ${CONTAINER_NAME_DEV} || true"
                    
                    sh "docker run -d -p ${PORT_DEV}:${PORT_CONTAINER} --name ${CONTAINER_NAME_DEV} ${DOCKER_IMAGE}"
                }
            }
        }
        stage('Docker Compose Up (Production)') {
            when {
                expression { env.GIT_BRANCH == 'origin/master' }
            }
            steps {
                script {
                    // Detener y eliminar el contenedor de desarrollo si existe
                    sh "docker stop ${CONTAINER_NAME_DEV} || true"
                    sh "docker rm ${CONTAINER_NAME_DEV} || true"
                    
                    sh "docker-compose -f ${COMPOSE_NAME} up -d"
                }
            }
        }
    }

    post {
        success {
            script {
                echo 'Pipeline succeeded!'
                sh "docker push ${DOCKER_IMAGE}"
            }
        }

        failure {
            script {
                echo 'Pipeline failed!'
            }
        }
    }
}
