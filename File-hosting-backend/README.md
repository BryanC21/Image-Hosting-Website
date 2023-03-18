Node.js Express backend for file hosting
==============================================

This is a Node.js Express web service used for file hosting. It is used as a backend for the file hosting project. Originally deployed on AWS Elastic Beanstalk, it has been migrated to AWS EC2. The service is deployed on an EC2 instance and uses an S3 bucket for file storage. It also relies on a mySQL database for user authentication and file metadata.

Contents
-----------

* README.md - this file
* server.js - this file contains the code for service
* tests/ - this directory contains unit tests for application
* template.yml - this file contains the description of AWS resources used by AWS CloudFormation to deploy infrastructure
* buildspec.yml - this file contains the description of AWS CodeBuild build process
* package.json - this file contains the list of dependencies for the application

Running Locally
---------------

1. Install Node.js dependencies:

        $ npm install

2. Start the development server:

        $ node server.js

3. By default running at http://127.0.0.1:5005/
