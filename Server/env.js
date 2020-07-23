require('dotenv').config();

const env = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    domain: process.env.DOMAIN,
    client_domain: process.env.CLIENT_DOMAIN,
    client_domain_prod: process.env.CLIENT_DOMAIN_PROD,
    token_secret: process.env.TOKEN_SECRET,
    encryption_key: process.env.ENCRYPTION_KEY,
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
  