const mongoose  = require('mongoose');
const env       = require('../env');
const conn      = mongoose.connection;

const mongoConn = mongoose.connect(`mongodb://${env.db_mongoDB.host}:${env.db_mongoDB.port}/${env.db_mongoDB.database}`, {
    auth: { "authSource": "admin" },
    user: env.db_mongoDB.username,
    pass: env.db_mongoDB.password,
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true
}).then(() => {
    return true
}).catch((e) => {
    console.log(e)
    return false
})

module.exports = mongoConn;