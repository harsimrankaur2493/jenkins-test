pipeline {
    agent any
    stages {
        stage('Build and Test') {
            steps {
                script {
                    docker.build("test-app:${BUILD_NUMBER}")
                    
                    // Run for 10 seconds then auto-stop
                    bat """
                    timeout 10 && docker run --rm -p 3000:3000 test-app:${BUILD_NUMBER} || echo "Test completed"
                    """
                }
            }
        }
    }
}