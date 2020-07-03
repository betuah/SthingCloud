const redis = require("redis")
const env = require('../env')

const config = {
    port      : env.redis.port,               // Set custom port
    host      : `${env.redis.host}`,        // Set hostanme or IP address
    // password  : `${env.redis.password}`,    // If using password set it here
    
    /* If using SSL */
    // tls       : {
    //   key  : stringValueOfKeyFile,  
    //   cert : stringValueOfCertFile,
    //   ca   : [ stringValueOfCaCertFile ]
}

const redisClient = redis.createClient(config)

module.exports = redisClient