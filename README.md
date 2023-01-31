# Store-Frontend-Backend

## Overview

This project is a store backend that that require front end to work perfectly.
the project provide the api required for basic tasks that includes users ,products and orders handling.

## auther

Ali Maher Al sheikh.

## Instructions

To run this project you need the following:

### Preparations before starting

#### Create .env file and fill it with the required enviroment variables using .env_example as a referance.

#### You need postgres database server installed.

#### You need to create user account on postgres using the following SQL instruction.

CREATE USER postgres WITH PASSWORD 1234;
postgres and 1234 is an examples of user name and password ,and you will probably want to use diffrent user name and password if so replace them with your username and password in the above command and then put the user name and the password in the .env file in the following environment variables
PG_DEV_USER as development user name
PG_DEV_PASSWORD as development user password
PG_TEST_USER as testing user name
PG_TEST_PASSWORD as testing user password

#### Create the required databases for testing, development or production using the following SQL instructions.

CREATE DATABASE shopping;
CREATE DATABASE shopping_test;
shopping and shopping_test is the default databases for development ant testing respectivly if you want to use diffrent names for you database names replace it in the above commands and put these names
in the following environment variables in .env file
PG_DEV_DB as development database name
PG_TEST_DB as testing database name

#### Grant the required permitions to the users in their relative databases for testing, development or production using the following SQL instructions.

GRANT ALL PRIVILEGES ON DATABASE shopping TO postgres;
GRANT ALL PRIVILEGES ON DATABASE shopping_test TO postgres;
if you are using diffrent user name or database names repace postgres,shopping,shopping_test in the above commands with the names of the users ,development database and testing data base respectively

### Then run this project by using node using the terminal by tying the following instruction:

'npm install;'
'npm run build;'
'npm run migrate'
'npm start;' or 'npm run start;'
Use a proper frontend or using proper api testing tool like ARC (advanced rest client) or postman

### Instructions for the diffrent tasks

#### General instructions

Many tasks require authentication by a user and some tasks require admin authentication.
To create user or logIn if you already have one and create user using admin user name and password that you used in .env file in the following environment variables ADMIN, ADMIN_PASS you can chang them later using update api and create other account for admin if you have more than one admin note that you can perform almost any task in the app if you have user account even you don't need to provide the old password if you want to change user data although that user will need to provide his password even if he is loggedin and have correct jwt key .
The jwt that you will get after signing up or logining in must be used
in the header of the requests you send to the server in Bearer formate.
All data sent to the server in the request body must be in the json form.

## Extras

If you are interested in testing you can run the basic tests of this appp by running 'npm run test' in the termina;

## technolgies

typescript
node
express
jasmine
prettier
eslint
dotenv
jsonwebtoken
bcrypt
cors
pg
db-migrate
nodemon
supertest
ts-node
