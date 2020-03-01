const express = require('express'),
    app         = express(),
    cors        = require('cors'),
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    port        = process.env.HTTP_PORT || 8080

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Dynamic CORS */
const whitelist = []
const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
  
app.use(cors(corsOptionsDelegate))
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