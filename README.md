<h1>SEA Cloud Platform (v0.1.3)</h1>

> **Desc :** This platform use for cloud platform was needs in SEAMEO SEAMOLEC. For this version we'll focus to build for IoT cloud platfom

## About Author
- **Name :** Betuah Anugerah
- **Email :** betuahanugerah@gmail.com
- **Github :** [My Github Libraries](https://github.com/betuah/)
<hr>

## Release feature (v0.1.3)
- Add Real Time device status
- Add Copy token button
- Fix device module (Device Menu)
- Fix Flooding to device API

## Installation
```sh
$ npm install && npm run install
```
##### OR
```sh
$ cd Server
$ npm install
$ cd ..
$ cd Client
$ npm install
```
<hr>

## Environment Setup
> Create .env file in every subfolder like API, Client, Socket and Server

#### Server .env file
```sh
HTTP_PORT=8000
HTTPS_PORT=8443
TOKEN_SECRET=YOUR_SECRET_TOKEN_PASSWORD
CLIENT_DOMAIN=http://YOUR_CLIENT_DOMAIN:3000
SERVER_DOMAIN=http://YOUR_SERVER_DOMAIN:8000
MYSQL_DB=db_cloud_platform
MYSQL_USERNAME=YOUR_MYSQL_USERNAME
MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD
MYSQL_HOST=YOUR_MYSQL_HOST
MYSQL_PORT=YOUR_MYSQL_PORT
MONGO_DB=db_cloud_platform
MONGO_USERNAME=YOUR_MONGODB_USERNAME
MONGO_PASSWORD=YOUR_MONGODB_PASSWORD
MONGO_HOST=YOUR_MONGODB_HOST
MONGO_PORT=YOUR_MONGODB_PORT
```

#### Client .env file
```sh
NODE_PATH=src/
REACT_APP_CLIENT_DOMAIN=http://YOUR_CLIENT_DOMAIN:3000
REACT_APP_SERVER_DOMAIN=http://YOUR_SERVER_DOMAIN:8000
```

#### API .env file
```sh
HTTP_PORT=4000
HTTPS_PORT=4443
TOKEN_SECRET=YOUR_SECRET_TOKEN_PASSWORD
CLIENT_DOMAIN=http://YOUR_CLIENT_DOMAIN:3000
SERVER_DOMAIN=http://YOUR_SERVER_DOMAIN:8000
MONGO_DB=db_cloud_platform
MONGO_USERNAME=YOUR_MONGODB_USERNAME
MONGO_PASSWORD=YOUR_MONGODB_PASSWORD
MONGO_HOST=YOUR_MONGODB_HOST
MONGO_PORT=YOUR_MONGODB_PORT
```

#### SocketIO .env file
```sh
HTTP_PORT=4001
HTTPS_PORT=4443
TOKEN_SECRET=H3r0es%@!B3tu*hG@nt&nGs34Cl0uDPl@tf0Rm2
CLIENT_DOMAIN=http://localhost:3000
SERVER_DOMAIN=http://localhost:8000
API_DOMAIN=http://localhost:4000
URL_DOMAIN=http://localhost
MONGO_DB=db_cloud_platform
MONGO_USERNAME=betuah
MONGO_PASSWORD=H3r0es!@#
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
```
<hr>

## Running APP
> **Note:** Firstly make sure your mysql server is running well!

```sh
$ npm run start 
```
<hr>

# Enjoy!

<hr>