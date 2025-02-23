# Personal Loan Application
Hi, thanks for the opportunity. Here's my technical test.


## Application setup
First let's start by initializing the app and then I'll explain a little bit about the project. Take in mind that you must have Docker installed in your PC.

1. Create a .env file in api/ with `SECRET_KEY={whatever word you want to use}`
2. Change directory to api/ and run `docker-compose up db --build -d` in your terminal to initialize the local development database.
3. Run `docker-compose up app --build` to run the node app.

## Test setup
We are also using docker to setup the testing environment. Take in mind that we are using different databases for the dev environment and the test environment, so everything that you do in dev won't affect the tests and vice versa.

1. Change directory to api/ and run `docker-compose up test_db --build -d` in your terminal to initialize the local testing database.
2. Run `docker-compose up test --build` to run the tests.

## Endpoints
Clarifications:
- When a login is required the request should send an "Authorization" header with a valid token.
- Admin users should be inserted manually in the database by assigning an "admin" role.

## /users

### Register a new user
This endpoint will create a new User into the database and it will return a token valid for 1 hour.
#### Request
```
curl -i -H 'Accept: application/json' -d 'email=john@doe.com&password=myPass12345&name=John Doe' http://localhost:3000/api/users/register
```
#### Response
```
HTTP/1.1 201 Created
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 189
Date: Sun, 23 Feb 2025 19:38:21 GMT
X-RateLimit-Reset: 1740339547
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 203
ETag: W/"cb-9T+/9M4K8OKT2Nx94n/xmkXUU0Q"
Connection: keep-alive
Keep-Alive: timeout=5

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqb2huQGRvZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDMzOTc4NiwiZXhwIjoxNzQwMzQzMzg2fQ.n2sja48JFdtD_DjhMN4QjUuyOs5RFjCgAPAhP3lEf5I"}
```

### Login a user
#### Request
```
curl -i -H 'Accept: application/json' -d 'email=john@doe.com&password=myPass12345' http://localhost:3000/api/users/login
```
#### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 199
Date: Sun, 23 Feb 2025 19:43:06 GMT
X-RateLimit-Reset: 1740340687
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 203
ETag: W/"cb-Pf32ugbFnOcNy7HAKlX10FME4mk"
Connection: keep-alive
Keep-Alive: timeout=5

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqb2huQGRvZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDMzOTc4NiwiZXhwIjoxNzQwMzQzMzg2fQ.n2sja48JFdtD_DjhMN4QjUuyOs5RFjCgAPAhP3lEf5I"}
```

## /loans

### Get all loans (user specific)
It will return all the loans that the logged in user has requested.
#### Request
```
curl -i -H "Accept: application/json" -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqb2huQGRvZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDMzOTc4NiwiZXhwIjoxNzQwMzQzMzg2fQ.n2sja48JFdtD_DjhMN4QjUuyOs5RFjCgAPAhP3lEf5I" http://localhost:3000/api/loans
```
#### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 194
Date: Sun, 23 Feb 2025 19:48:20 GMT
X-RateLimit-Reset: 1740340687
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 2
ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
Connection: keep-alive
Keep-Alive: timeout=5

[]
```

### Create a new Loan
It will create a new Loan into the database with a "Pending" status.
#### Request
```
curl -i -H 'Accept: application/json' -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqb2huQGRvZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDMzOTc4NiwiZXhwIjoxNzQwMzQzMzg2fQ.n2sja48JFdtD_DjhMN4QjUuyOs5RFjCgAPAhP3lEf5I' -d 'amount=200&purpose=bussiness&duration=3' http://localhost:3000/api/loans
```
#### Response
```
HTTP/1.1 201 Created
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 192
Date: Sun, 23 Feb 2025 19:50:55 GMT
X-RateLimit-Reset: 1740340687
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 27
ETag: W/"1b-ABzee/zAg242sFR7/KFNvrsRN5g"
Connection: keep-alive
Keep-Alive: timeout=5

"Loan Successfully created"
```

### Get a Loan
Should receive a loan_id in the params and if there's a match between the user_id of the logged in user and the loan_id, it will return the information of the specific Loan.
#### Request
```
curl -i -H "Accept: application/json" -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJnYXNwYXJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDAzMzg2NDYsImV4cCI6MTc0MDM0MjI0Nn0.hiOa5BtXP2JcEcS_GOhIVctTu4-heC09TZRfjoPpnsg" http://localhost:3000/api/loans/1
```
#### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 190
Date: Sun, 23 Feb 2025 19:52:28 GMT
X-RateLimit-Reset: 1740340687
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 206
ETag: W/"ce-Ajs3a7BgoZZeHP1cBUUH+BbO6JQ"
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"user_id":1,"amount":200,"purpose":"bussiness","duration":3,"status":"Pending","total_paid":0,"remaining_balance":200,"created_at":"2025-02-23T19:50:56.042Z","updated_at":"2025-02-23T19:50:56.042Z"}
```



### Update loan status
The logged in user should have an admin role and will update the status of a specific Loan to Approved or Rejected.
#### Request
```
curl -i -H 'Accept: application/json' -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJnYXNwYXJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQwMzQwNjAwLCJleHAiOjE3NDAzNDQyMDB9.KFfyqTaeTZtFulJWOpb9mwQgJUVIy8P4ltt1sWf3sOo' -d 'status=Approved' -X PATCH http://localhost:3000/api/loans/1/status
```
#### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 199
Date: Sun, 23 Feb 2025 19:58:19 GMT
X-RateLimit-Reset: 1740341600
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-kkWhT85r+B6iIJpbphNCi6ocbJ0"
Connection: keep-alive
Keep-Alive: timeout=5

"Loan status updated"
```

### Get payments associated with a loan_id
If there's a match between the loan_id and the user_id, it will return all the Payments associated with that Loan of that specific user.
#### Request
```
curl -i -H "Accept: application/json" -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqb2huQGRvZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDMzOTc4NiwiZXhwIjoxNzQwMzQzMzg2fQ.n2sja48JFdtD_DjhMN4QjUuyOs5RFjCgAPAhP3lEf5I" http://localhost:3000/api/loans/2/payments
```
#### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 190
Date: Sun, 23 Feb 2025 20:03:10 GMT
X-RateLimit-Reset: 1740341600
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 207
ETag: W/"cf-0ZgWYUqbBhC1ZUlsPNpoSBBIB0A"
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"user_id":1,"amount":200,"purpose":"bussiness","duration":6,"status":"Approved","total_paid":200,"remaining_balance":0,"created_at":"2025-02-23T19:25:02.466Z","updated_at":"2025-02-23T19:25:02.466Z"}
```

### /payments

### Create a payment
If there's a match between the user_id, the loan_id and the status of the Loan is "Approved", it will create a Payment record and it will rest from the Loan's remaining balance, the amount_paid of the Payment.
#### Request
```
curl -i -H 'Accept: application/json' -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqb2huQGRvZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDMzOTc4NiwiZXhwIjoxNzQwMzQzMzg2fQ.n2sja48JFdtD_DjhMN4QjUuyOs5RFjCgAPAhP3lEf5I' -d 'amount_paid=100&loan_id=1' http://localhost:3000/api/payments
```
#### Response
```
HTTP/1.1 201 Created
X-Powered-By: Express
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 187
Date: Sun, 23 Feb 2025 20:05:46 GMT
X-RateLimit-Reset: 1740341600
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Content-Type: application/json; charset=utf-8
Content-Length: 30
ETag: W/"1e-dRnS0jqspi3GiuDzvCMxPu7JbBA"
Connection: keep-alive
Keep-Alive: timeout=5

"Payment successfully created"
```

(PS1: I recognize that a user shouldn't be able to create a Payment whenever they want. In a real environment it should involve payment methods and a payment processing tool.)

(PS2: Since everything is for local development I'm not using .env to store the db credentials but if we were to deploy this in the cloud we should set up NODE_ENV to "production" and assign a DB_USER_PROD, DB_PASSWORD_PROD, etc.)