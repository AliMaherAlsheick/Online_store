# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Users

In the following urls replace :port with port of the proper enviroment thazt you provided in the .env file and replace :id with rhe requested user id.

#### LogingIn:

use post method with the following path:
http://localhost/:port/user/logIn
the request body has the form:
{
user_name: string;
user_password: string;  
}

#### SigningUP (Create) :

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

#### Getting users (Index) [admin authentication required]:

use get method with the following path:
http://localhost/:port/user/
you must provide jwt key of admin.

#### Show any user by his id as admin (Show)[admin authentication or the required user authentication required]:

use get method with the following path:
http://localhost/:port/user/:id
you must provide jwt key of the admin.

#### Delete user (delete) [admin authentication or the required user authentication required]:

use delete method with the following path:
http://localhost/:port/user/:id
you must provide jwt key of the requested user or of admin.

#### Change user data (update) [admin authentication or the required user authentication required]:

use patch method with the following path:
http://localhost/:port/user/:id
you must provide jwt key of the requested user
the requestbody has the form
{
first_name?: string;
last_name?: string;
email?: string;
user_name?: string;
user_password: string;
phone?: string;
new_password?: string;
}
you need to provide only the properites you want to change in addition to the password and when you want to chang the password you need to provide the new password in new_password .
note admin doesn't need to provide the current password in any case.
note that username must be uniqe and password must be more than 8 characters.
you must provide jwt key of the requested user or of admin.

#### Products

In the following urls replace :port with port of the proper enviroment that you provided in the .env file and replace :id with the requested product id.

#### creating product (create)[admin authentication required]:

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

#### Getting products (Index):

use get method with the following path:
http://localhost/:port/product/

#### Show product by id (show):

use get method with the following path:
http://localhost/:port/product/:id

#### Delete product (delete):

use delete method with the following path:
http://localhost/:port/product/:id
you must use authentication as admin.

#### Change product data (update):

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

#### search Products:

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

#### Orders

In the following urls replace :port with port of the proper enviroment that you provided in the .env file.

#### Creating order (create)[user authentication required]:

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

#### Getting orders of a user [user authentication required]:

use get method with the following path:
http://localhost/:port/order/
you must provide jwt key of the requested user.

#### Show any order by its id [admin or the requested user authentication required]:

use get method with the following path:
http://localhost/:port/order/:id
replace :id with the order id.

you must provide jwt key of the user that created the requested order or admin jwt.

#### Delete order by its id [admin or the requested user authentication required].

use delete method with the following path:
http://localhost/:port/order/:id
replace :id with the order id.

you must provide jwt key of the user that created the requested order or admin jwt.

#### Change order basic data using order id [admin or the requested user authentication required].

use patch method with the following path:
http://localhost/:port/order/:id
replace :id with the order id.

the request body has the form
{
delivery_cost: number,
order_address: string,
status:string
}
you need to provide only the properites you want to change.
you must provide jwt key of the user that created the requested order or admin jwt.

#### add order to the cart using order id [user authentication required].

use post method with the following path:
http://localhost/:port/order/:id
replace :id with the order id.

the request body has the form
{
product_id: number;
quantity: number;
}

you must provide jwt key of the user that created the requested order.

#### Change order cart data using order cart element id [user authentication required].

use put method with the following path:
http://localhost/:port/order/:id
replace :id with the order id.

the request body has the form
{
product_id?: number;
quantity?: number;
}
you need to provide only the properites you want to change.
if the body was empty the element will be deleted.
you must provide jwt key of the user that created the requested order.

## Data Shapes

#### Product

-   img_url
-   name
-   price
-   amount
-   date_of_change
-   category

#### User

-   first_name
-   last_name
-   email
-   user_name
-   user_password
-   phone

#### Orders

-   id of each product in the order
-   quantity of each product in the order
-   status of order (active or complete)
-   delivery_cost
-   order_address
    you don't need to provide user id we infer it from user jwt
