const express   = require('express'),
    app         = express(),
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    env         = require('./env'),
    port        = env.port || 5000

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Start of Routing Import */
const iotRoute     = require('./routes/iot_route');
iotRoute(app);
/* End of Routing Import */

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    app.listen(port, () => console.log(`IoT API listen on ${env.domain}:${env.port}`));
} else {
    console.log(`${env.domain}:${env.port} cannot connect to MongoDB!`)
}
/* End MongoDB Connection Check */