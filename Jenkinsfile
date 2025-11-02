pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'jenkins-demo-app'
        DOCKER_TAG = "build-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout and List Files') {
            steps {
                echo 'Code is automatically checked out by Jenkins'
                bat 'dir'  // List files to verify checkout
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Check if Dockerfile exists
                    bat 'type Dockerfile || echo "Dockerfile not found - creating simple one"'
                    
                    // Create simple Dockerfile if missing (for testing)
                    bat '''
                    echo FROM alpine:latest > Dockerfile
                    echo CMD echo "Hello from Docker Build ${BUILD_NUMBER}" >> Dockerfile
                    '''
                    
                    // Build Docker image
                    docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
                }
            }
        }
        
        stage('Run Test Container') {
            steps {
                script {
                    bat "docker run --rm ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                }
            }
        }
        
        stage('Deploy to Local') {
            steps {
                script {
                    // Stop existing container
                    bat 'docker stop jenkins-demo-app || echo "No container to stop"'
                    bat 'docker rm jenkins-demo-app || echo "No container to remove"'
                    
                    // Run new container
                    bat """
                    docker run -d ^
                        --name jenkins-demo-app ^
                        -p 8080:80 ^
                        ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed - cleaning up'
            // Clean up Docker containers
            bat 'docker stop jenkins-demo-app || echo "No container to stop"'
            bat 'docker rm jenkins-demo-app || echo "No container to remove"'
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}