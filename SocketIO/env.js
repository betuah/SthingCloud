require('dotenv').config();

const env = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    httpsPrivateKey: process.env.HTTPS_PRIVATE_KEY_PATH,
    httpsCertificate: process.env.HTTPS_CERTIFICATE_PATH,
    host: process.env.HOST,
    client_host: process.env.CLIENT_HOST,
    client_host_prod: process.env.CLIENT_HOST_PROD,
    server_host: process.env.SERVER_HOST,
    iot_gateway_host: process.env.IOT_GATEWAY_HOST,
    mqtt_broker_host: process.env.MQTT_BROKER_HOST,
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
  