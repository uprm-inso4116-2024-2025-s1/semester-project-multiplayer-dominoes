# Overview
This project is an Express app in Node.js with MongoDB. 

The project follows the **Model/Handler/Controller** structure to keep organized and maintain clear responsabilities between components.
* **Model**: defines the schema and provides a way to query the database for read/write operations.
* **Handler**: mainly composed of the business logic of the system.
* **Controller**: responsible for writing the response to the client.

# Setup to run the project locally.
- Node installation.
- Install dependencies.
- Setup mongodb locally.
- Create `.env` file.
- Run the server.

## Node installation
Make sure you have node installed in your computer, see [these instructions](../frontend/README.md).

## Install dependencies
In `/backend` directory, run `npm install` to download and install all the project's dependencies.
```sh
> cd backend/
> npm install
```

## How to setup MongoDB locally
Follow these instructions depending on your local machine:
- [Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
- [Mac](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
- [Linux](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

After installation, you must enable authentication to the database by following **steps 1-5** in these instructions: [Enable Access Control](https://www.mongodb.com/docs/v4.0/tutorial/enable-authentication/).

Using the newly created admin user, create a new user with read/write privileges for this project's database. Open up the `mongosh` terminal and execute the following commands:
```sh
test> use multiplayerDominoes
# switched to db multiplayerDominoes <- this creates the database
multiplayerDominoes> db.createUser({user:"yourUser", pwd:"yourUserPassword", roles:[{role: "readWrite", db:"multiplayerDominoes"}]})
# { ok: 1 }
```

Close the `mongosh` terminal, open up a new one and run the following commands:
```sh
test> use multiplayerDominoes
# switched to db multiplayerDominoes
multiplayerDominoes> db.auth("yourUser", "yourUserPassword")
# { ok: 1 }
```

Test out your user by inserting and reading a document:
```sh
multiplayerDominoes> db.myCollection.insertOne({x:1})
# {
#   acknowledged: true,
#   insertedId: ObjectId('id')
# }
multiplayerDominoes> db.myCollection.find()
[ { _id: ObjectId('id'), x: 1 } ]
```

> NOTE: "*myCollection*" is equivalent to the table name in the db.

## Add MongoDB Connection String to `.env` file
* Create a `.env` file in the root of the backend directory (`/backend/.env`).

> NOTE: Do NOT give the `.env` file a name (e.g. `dev.env`)! Leave it as `.env` only.

* Add the following environment variable with the credentials of the db user you created:
```txt
MONGODB_URI=mongodb://<yourUser>:<your userPassword>@localhost:27017/multiplayerDominoes
```
> NOTE: Make sure you get rid of the *"<>"* when replacing your user name and password.

## Run the server
Execute `npm run dev` to run the server with `nodemon`, you should get the following output:
```sh
/> npm run dev

> semester-project-multiplayer-dominoes-server@1.0.0 dev
> nodemon src/index.js

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/index.js`
Server listening on port 8080
Connected to MongoDB
```

You have successfully setup the backend! If needed, visit the [frontend README](../frontend/README.md) to setup it up locally.

## To be able to use the Password Reset feature:
* Run 'npm install nodemailer'
* Make sure that the '.env' looks like this:
```txt
MONGODB_URI=mongodb://<yourUser>:<your userPassword>@localhost:27017/multiplayerDominoes
JWT_SECRET=23b3f7bb2c2993a97f8b13c96389939d2b9a0c69dbf836f4a79a7d1dd82aa2bc
PORT=8080
EMAIL_SERVICE=gmail
EMAIL_USER=multiplayerdominoes@gmail.com
EMAIL_PASSWORD=zdlsyxlsrbvltqsu
FRONTEND_URL=http://localhost:3000
```