require('dotenv').config();

const env = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    httpsPrivateKey: process.env.HTTPS_PRIVATE_KEY_PATH,
    httpsCertificate: process.env.HTTPS_CERTIFICATE_PATH,
    host: process.env.HOST,
    http_port: process.env.HTTP_PORT, 
    https_port: process.env.HTTPS_PORT,
    socket_host: process.env.SOCKET_HOST,
    client_host: process.env.CLIENT_HOST,
    client_host_prod: process.env.CLIENT_HOST_PROD,
    token_secret: process.env.TOKEN_SECRET,
    encryption_key: process.env.ENCRYPTION_KEY,
    mqtt_broker_host : process.env.MQTT_BROKER_HOST,
    mqtt_broker_port : process.env.MQTT_BROKER_PORT,
    mqtt_admin_secret : process.env.MQTT_ADMIN_SECRET,
    db_mongoDB: {
        database: process.env.MONGO_DB,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }  
};
   
module.exports = env;
  