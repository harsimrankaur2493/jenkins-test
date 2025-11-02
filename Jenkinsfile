pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'your-dockerhub-username/jenkins-demo-app'
        DOCKER_TAG = "build-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/your-username/your-repo-name.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    // Run container and execute tests
                    docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").inside {
                        sh 'npm test'
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub (configure credentials in Jenkins first)
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    }
                }
            }
        }
        
        stage('Deploy to Local') {
            steps {
                script {
                    // Stop and remove existing container
                    sh 'docker stop jenkins-demo-app || true'
                    sh 'docker rm jenkins-demo-app || true'
                    
                    // Run new container
                    sh """
                    docker run -d \
                        --name jenkins-demo-app \
                        -p 3000:3000 \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('Smoke Test') {
            steps {
                script {
                    // Wait for app to start
                    sleep time: 10, unit: 'SECONDS'
                    
                    // Test if application is responding
                    sh """
                    curl -f http://localhost:3000/health || exit 1
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed - cleaning up'
            // Clean up Docker containers and images
            sh 'docker ps -aq --filter name=jenkins-demo-app | xargs -r docker rm -f'
        }
        success {
            echo '✅ Pipeline succeeded!'
            slackSend channel: '#your-channel', message: "Pipeline SUCCESS: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        failure {
            echo '❌ Pipeline failed!'
            slackSend channel: '#your-channel', message: "Pipeline FAILED: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
    }
}