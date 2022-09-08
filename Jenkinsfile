pipeline {
    // agent any means => jenkins, find us what is required? to build with node or what
    agent any
    stages {
        stage('Source') {
            steps {
                // Get  code from a GitHub repository
                git 'https://github.com/VrishtiGupta11/phatakapp.git'

                // Run npm install
                bat "npm install"

                echo 'Source Stage Finished'
            }
        }

        stage('Test') {
            steps {
                //sh(script: 'node_modules/.bin/cypress run || true')
                //  sh "npm run cypress:run"         
                // bat "npm run cy:open"         
                bat "npm run cy:run"         
            }
        }

        stage('Build') {
            steps {
                // Run ng build command
                bat "ng build"
                echo 'Test Stage Finished'
            }
        }
    }
}