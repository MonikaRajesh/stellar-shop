pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('stellar-shop') {
                    sh 'npm ci'
                }
            }
        }

        stage('Build') {
            steps {
                dir('stellar-shop') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Vercel') {
            steps {
                dir('stellar-shop') {
                    sh 'npx vercel --prod --yes --token="$VERCEL_TOKEN"'
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD PIPELINE SUCCESSFUL'
        }

        failure {
            echo 'CI/CD PIPELINE FAILED'
        }
    }
}
