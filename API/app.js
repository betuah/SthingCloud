const express = require('express'),
    app         = express(),
    cors        = require('cors')
    port        = process.env.PORT || 8000,
    bodyParser  = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Dynamic CORS */
var whitelist = ['http://localhost:8000', 'http://localhost:3000']

var options = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback("Not allowed by SEA Cloud Platform API'S");
            // console.log(callback(new Error("Not allowed by SEA Cloud Platform API'S")));
        }
    }
}

app.use(cors(options))
/* End Dynamic CORS */

/* Start of Routing Import */
const authRoute     = require('./routes/auth_route');
const usersRoute    = require('./routes/users_route');
const deviceRoute   = require('./routes/device_route');

authRoute(app);
usersRoute(app);
deviceRoute(app);
/* End of Routing Import */

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    app.listen(port);
} else {
    console.log("MongoDB Not Connected!")
}
/* End MongoDB Connection Check */

console.log('SEAMOLEC Cloud Platform API SERVER running up on port : ' + port);