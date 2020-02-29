const mysql = require('mysql');
const env = require('../env.js');

const db_mysql = mysql.createConnection({
    host: env.db_mysql.host,
    user: env.db_mysql.username,
    password: env.db_mysql.password,
    database: env.db_mysql.database
});

db_mysql.connect(function (err){
    if(err) throw err;
});

module.exports = db_mysql;