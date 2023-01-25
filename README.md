# Store-Frontend-Backend

## Overview

This project is a store backend that that require front end to work perfectly.
the project provide the api required for basic tasks that includes users ,products and orders handling.

## auther

Ali Maher Al sheikh.

## Instructions

To run this project you need the following:

### Preparations before starting

You need postgres database server.
yYou need to create user account on postgres .
Create the required databases for testing, development or production
Create .env file and fill it with the required enviroment variables using .env_example as a referance.

### Then run this project by using node using the terminal by tying the following instruction:

'npm install;'
'npm run build;'
'npm run migrate'
'npm start;' or 'npm run start;'
Use a proper frontend or using proper api yesting tool like ARC (advanced rest client) or postman

### Instructions for the diffrent tasks

#### General instructions

Most tasks require authentication by a user and some tasks require admin authentication.
To create user or logIn if you already have one and create user using admin user name and password that you used in .env file in the following environment variables ADMIN, ADMIN_PASS.
The jwt that you will get after signing up or logining in must be used
in the header of the requests you send to the server in Bearer formate.
All data sent to the server in the request body must be in the json form.

#### handling users

In the following urls replace :port with port of the proper enviroment thazt you provided in the .env file and replace :id with rhe requested user id.

##### LogingIn:

use post method with the following path:
http://localhost/:port/user/logIn
the request body has the form:
{
user_name: string;
user_password: string;  
}

##### SigningUP:

use post method with the following path:
http://localhost/:port/user/
the request body has the form:
{

    first_name: string;
    last_name: string;
    email?: string;
    user_name: string;
    user_password: string;
    phone?: string;

}
the properites followed by ? is optional;
Username must be uniqe and password must be more than 8 charachters

##### Getting users as admin:

use get method with the following path:
http://localhost/:port/user/
you must provide jwt key of admin.

##### Show any user by his id as admin:

use get method with the following path:
http://localhost/:port/user/:id
you must provide jwt key of the admin.

##### Delete user:

use delete method with the following path:
http://localhost/:port/user/:id
you must provide jwt key of the requested user

##### Change user data:

use patch method with the following path:
http://localhost/:port/user/:id
you must provide jwt key of the requested user
the requestbody has the form
{
first_name?: string;
last_name?: string;
email?: string;
user_name?: string;
user_password?: string;
phone?: string;
new_password?: string;
}
you need to provide only the properites you want to change and when changing user name or password you need to provide the old password and in case of changing user name provide the value of the new username in new_password
note that username must be uniqe and password must be more than 8 characters.

#### handling products

In the following urls replace :port with port of the proper enviroment thazt you provided in the .env file and replace :id with rhe requested user id.

##### creating product:

use post method with the following path:
http://localhost/:port/product/
the request body has the form:
{
img_url: string;
name: string;
price: number;
amount: number;
date_of_change: string;
category: string;
}
all properites are required.
you must use authentication as admin.

##### Getting products:

use get method with the following path:
http://localhost/:port/product/

##### Show product by id :

use get method with the following path:
http://localhost/:port/product/:id

##### Delete product:

use delete method with the following path:
http://localhost/:port/product/:id
you must use authentication as admin.

##### Change product data:

use patch method with the following path:
http://localhost/:port/product/:id
you must use authentication as admin.
the request body has the form
{
img_url: string;
name: string;
price: number;
amount: number;
date_of_change: string;
category: string;
}
you need to provide only the properites you want to change.

##### search Products:

use put method with the following path:
http://localhost/:port/product/

the request body has the form
{
search_value: string | number;
searchOptions: {
name?: boolean;
price?: boolean;
rating?: boolean;
date_of_change?: boolean;
category?: boolean;
}
you need to provide only the properites you want to serch throw and at least one the search automatically search for results similar to search value.

#### handling orders

In the following urls replace :port with port of the proper enviroment thazt you provided in the .env file.

##### Creating product :

use post method with the following path:
http://localhost/:port/order/
the request body has the form:
{
product_id: number,
quantity: number,
delivery_cost: number,
order_address: string,
}
you must provide jwt key of the requested user.

##### Getting orders of a user:

use get method with the following path:
http://localhost/:port/order/
you must provide jwt key of the requested user.

##### Show any order by its id :

use get method with the following path:
http://localhost/:port/order/:id
you must provide jwt key of the user that created the requested order.

##### Delete order by its id:

use delete method with the following path:
http://localhost/:port/order/:id
you must provide jwt key of the user that created the requested order.

##### Change order basic data using order id:

use patch method with the following path:
http://localhost/:port/order/:id

the request body has the form
{
delivery_cost: number,
order_address: string,
status:string
}
you need to provide only the properites you want to change.
you must provide jwt key of the user that created the requested order.

##### add order to the cart using order id:

use post method with the following path:
http://localhost/:port/order/:id

the request body has the form
{
product_id: number;
quantity: number;
}

you must provide jwt key of the user that created the requested order.

##### Change order cart data using order cart element id:

use put method with the following path:
http://localhost/:port/order/:id

the request body has the form
{
product_id?: number;
quantity?: number;
}
you need to provide only the properites you want to change.
if the body was empty the element will be deleted.
you must provide jwt key of the user that created the requested order.

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
