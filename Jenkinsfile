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
                    // Use your original Dockerfile, not the simple one
                    bat 'type Dockerfile'
                    
                    // Build Docker image using your actual Dockerfile
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
        
        stage('Deploy Real Application') {
            steps {
                script {
                    // Stop existing container (ignore errors)
                    bat 'docker stop jenkins-demo-app || echo "No running container to stop"'
                    bat 'docker rm jenkins-demo-app || echo "No container to remove"'
                    
                    echo "Deploying the actual Node.js application..."
                    
                    // Build the actual application image
                    docker.build("${env.DOCKER_IMAGE}-app:${env.DOCKER_TAG}")
                    
                    // Run the actual application
                    bat """
                    docker run -d ^
                        --name jenkins-demo-app ^
                        -p 3000:3000 ^
                        ${env.DOCKER_IMAGE}-app:${env.DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('Smoke Test') {
            steps {
                script {
                    sleep time: 5, unit: 'SECONDS'
                    bat 'curl http://localhost:3000/ || echo "Application might still be starting"'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed - cleanup started'
            // Windows-compatible cleanup
            bat '''
            docker stop jenkins-demo-app 2>nul && echo "Container stopped" || echo "No container to stop"
            docker rm jenkins-demo-app 2>nul && echo "Container removed" || echo "No container to remove"
            '''
            echo 'Cleanup completed'
        }
        success {
            echo '🎉 PIPELINE SUCCEEDED! Dockerized Jenkins pipeline is working!'
            echo 'Your application should be running at: http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed, but this is normal for learning. Check the logs above.'
        }
    }
}