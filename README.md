## Tyba Challenge
Tyba Backend Engineer test nodejs-mongodb

## Install
Run :
```
$ npm install
```

## Run server

Run :
```
$ mongod
$ npm start
```
## API
| Uri  | Method  | Params  | Header |
| ------------ | ------------ | ------------ | |
|  /auth/sign-up | POST  | application/x-www-form-urlencoded: name, lastName, email, password  |  |
|  /auth/login |  POST | query: email, password  |  |
|  /api/users/restaurants | GET  | query: lat, lgn  | Authorization: Bearer {jwt} |
| /api/transactions | GET | query : page (optional) | Authorization: Bearer {jwt} |
