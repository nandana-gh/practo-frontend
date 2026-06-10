pipeline {
 
agent any
 
environment {
 
IMAGE = "practo-frontend:${BUILD_NUMBER}"
 
CONT = "practo_frontend"
 
}
 
stages {
 
stage('Checkout') {
 
steps { checkout scm }
 
}
 
stage('Debug') {
    steps {
        bat 'echo IMAGE=%IMAGE%'
    }
}
 
stage('Build Docker Image') {
 
steps {
 
bat 'docker build -t %IMAGE% .'
 
}
 
}
 
stage('Run Container') {
 
steps {
 
bat 'docker rm -f %CONT% >nul 2>&1 || exit 0'
 
bat 'docker run -d --name %CONT% -p 8081:80 %IMAGE%'
 
}
 
}
 
}
}