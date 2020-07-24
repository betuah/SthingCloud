require('dotenv').config();

const env = {
    port: parseInt(process.env.PORT),
    node_env: process.env.NODE_ENV,
    httpsPrivateKey: process.env.HTTPS_PRIVATE_KEY_PATH,
    httpsCertificate: process.env.HTTPS_CERTIFICATE_PATH,
    domain: process.env.DOMAIN,
    socket_domain: process.env.SOCKET_DOMAIN,
    token_secret: process.env.TOKEN_SECRET,
    mqtt_admin_secret: process.env.ADMIN_SECRET,
    db_mongoDB: {
        database: process.env.MONGO_DB,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT
    }    
};
   
module.exports = env;
  