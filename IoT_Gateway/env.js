require('dotenv').config();

const env = {
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    http_port: process.env.HTTP_PORT, 
    https_port: process.env.HTTPS_PORT,
    socket_domain: process.env.SOCKET_DOMAIN,
    client_domain: process.env.CLIENT_DOMAIN,
    token_secret: process.env.TOKEN_SECRET,
    encryption_key: process.env.ENCRYPTION_KEY,
    mqtt_broker_domain : process.env.MQTT_BROKER_domain,
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
  