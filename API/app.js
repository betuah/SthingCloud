const express = require('express'),
    app         = express(),
    cors        = require('cors'),
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    env         = require('./env')
    port        = env.http_port || 8080

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Dynamic CORS */
const whitelist = ['http://localhost:8000','http://localhost:3000']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            // callback('Origin are Not allowed!')
            callback(null, true)
        }
    }
}
  
app.use(cors(corsOptions))
/* End Dynamic CORS */

/* Start of Routing Import */
const iotRoute     = require('./routes/iot_route');
iotRoute(app);
/* End of Routing Import */

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    app.listen(port);
} else {
    console.log("MongoDB Not Connected!")
}
/* End MongoDB Connection Check */

console.log('SEAMOLEC Cloud Platform IOT API running up on port : ' + port);