# Personal Loan Application
Hi, thanks for the opportunity. Here's my technical test.


## Application setup
First let's start by initializing the app and then I'll explain a little bit about the project. Take in mind that you must have Docker installed in your PC.

1. Create a .env file in api/ with `SECRET_KEY={whatever word you want to use}`
2. Change directory to api/ and run `docker-compose up db --build -d` in your terminal to initialize the local development database.
3. Run `docker-compose up app --build` to run the node app.
4. Connect to the REST API via Postman or any other similar client by sending requests to localhost:3000/api/...

## Test setup
We are also using docker to setup the testing environment. Take in mind that we are using different databases for the dev environment and the test environment, so everything that you do in dev won't affect the tests and vice versa.

1. Change directory to api/ and run `docker-compose up test_db --build -d` in your terminal to initialize the local testing database.
2. Run `docker-compose up test --build` to run the tests.

## Endpoints
Clarifications:
- When a login is required the request should send an "Authorization" header with a valid token.
- Admin users should be inserted manually in the database by assigning an "admin" role.

### /users

1. POST /api/users/register
```
PAYLOAD: {
    "name", (4 characters minimum)
    "email", (unique)
    "password" (8 characters minimum)
}
```
This endpoint will create a new User into the database and it will return a token valid for 1 hour.

2. POST /api/users/login
```
PAYLOAD: {
    "email",
    "password"
}
```
It will try to find a User with the same email and password. If there are no matches it will return a 400 response else it will return a token valid for 1 hour.

### /loans

1. GET /api/loans (login required)
It will return all the loans that the logged in user has requested.

2. POST /api/loans (login required)
```
PAYLOAD: {
    "amount", 
    "purpose",
    "duration"
}
```
It will create a new Loan into the database with a "Pending" status.

3. GET /api/loans/:id (login required)

Should receive a loan_id in the params and if there's a match between the user_id of the logged in user and the loan_id, it will return the information of the specific Loan.

4. PATCH /api/loans/:loan_id/status (login required)
```
PAYLOAD: {
    "status", (must be "Approved" or "Rejected")
}
```
The logged in user should have an admin role and will update the status of a specific Loan to Approved or Rejected.

5. GET /api/loans/:loan_id/payments (login required)

If there's a match between the loan_id and the user_id, it will return all the Payments associated with that Loan of that specific user.

### /payments

1. POST /api/payments (login required)
```
PAYLOAD: {
    "amount_paid", (must be less or equal than the remaining balance of the associated Loan)
    "loan_id"
}
```
If there's a match between the user_id, the loan_id and the status of the Loan is "Approved", it will create a Payment record and it will rest from the Loan's remaining balance, the amount_paid of the Payment.

(PS1: I recognize that a user shouldn't be able to create a Payment whenever they want. In a real environment it should involve payment methods and a payment processing tool.)

(PS2: Since everything is for local development I'm not using .env to store the db credentials but if we were to deploy this in the cloud we should set up NODE_ENV to "production" and assign a DB_USER_PROD, DB_PASSWORD_PROD, etc.)