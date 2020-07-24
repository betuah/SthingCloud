require('dotenv').config();

const env = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    httpsPrivateKey: process.env.HTTPS_PRIVATE_KEY_PATH,
    httpsCertificate: process.env.HTTPS_CERTIFICATE_PATH,
    domain: process.env.DOMAIN,
    client_domain: process.env.CLIENT_DOMAIN,
    client_domain_prod: process.env.CLIENT_DOMAIN_PROD,
    server_domain: process.env.SERVER_DOMAIN,
    iot_gateway_domain: process.env.IOT_GATEWAY_DOMAIN,
    mqtt_broker_domain: process.env.MQTT_BROKER_DOMAIN,
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
  