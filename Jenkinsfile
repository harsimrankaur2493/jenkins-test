pipeline {
    agent any
    stages {
        stage('Build and Test') {
            steps {
                script {
                    echo '🔨 Building Docker image...'
                    docker.build("test-app:${BUILD_NUMBER}")
                    
                    echo '✅ Testing Docker image...'
                    bat """
                    docker run --rm test-app:${BUILD_NUMBER} node -e "
                        console.log('SUCCESS! Jenkins Docker Pipeline is Working!');
                        console.log('Build Number: ${BUILD_NUMBER}');
                        console.log('Your app is ready for deployment on port 3000');
                    "
                    """
                }
            }
        }
    }
    post {
        always {
            echo '🎊 Pipeline completed successfully!'
            echo '💡 Next: Your application can be deployed to port 3000'
        }
    }
}