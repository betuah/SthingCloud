require('dotenv').config();

const env = {
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    client_domain: process.env.CLIENT_DOMAIN,
    api_domain: process.env.API_DOMAIN,
    token_secret: process.env.TOKEN_SECRET,
    db_mysql: {
        database: process.env.MYSQL_DB,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT
    },
    db_mongoDB: {
        database: process.env.MONGO_DB,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT
    }    
};
   
module.exports = env;
  