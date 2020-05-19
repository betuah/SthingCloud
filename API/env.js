require('dotenv').config();

const env = {
    http_port: process.env.HTTP_PORT, 
    https_port: process.env.HTTPS_PORT,
    socket_domain: process.env.SOCKET_DOMAIN,
    token_secret: process.env.TOKEN_SECRET,
    db_mongoDB: {
        database: process.env.MONGO_DB,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT
    }    
};
   
module.exports = env;
  