require('dotenv').config();

const env = {
    client_domain:process.env.CLIENT_DOMAIN,
    server_domain:process.env.SERVER_DOMAIN,
    api_domain:process.env.API_DOMAIN,
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
  