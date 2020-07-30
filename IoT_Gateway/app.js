const express   = require('express'),
    app         = express(),
    cors        = require('cors'),
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    env         = require('./env'),
    fs          = require("fs"),
    https       = require('https'),
    port        = env.port || 7000

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* Dynamic CORS */
const whitelist = [`${env.client_host}`,`${env.client_host_prod}`,`${env.socket_host}`,`${env.mqtt_broker_host}`]

const options = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback("Origin Not allowed!", false)
            // console.log(callback(new Error("Not allowed by SEA Cloud Platform API'S")));
        }
    }
}

app.use(cors(options))
/* End Dynamic CORS */

/* Subscriptions Message Data Controller */
require('./controllers/iot_deviceData')
/* End Subscriptions Message

/* Start of Routing Import */
const iotRoute  = require('./routes/iot_route')
iotRoute(app)
/* End of Routing Import */

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    if (env.node_env === 'production') {
        try {
            const privateKey  = fs.readFileSync(`${env.httpsPrivateKey}`, 'utf8')
            const certificate = fs.readFileSync(`${env.httpsCertificate}`, 'utf8')
            const credentials = {key: privateKey, cert: certificate}
            const httpsApps   = https.createServer(credentials, app)

            httpsApps.listen(port, () => console.log(`Production IoT Gateway listen on ${env.host}:${env.port}`))
        } catch (error) {
            console.log(new Error(error))
        }
    } else {
        app.listen(port, () => console.log(`Development IoT Gateway listen on ${env.host}:${env.port}`))
    }
} else {
    console.log(new Error(`${env.host}:${env.port} cannot connect to MongoDB!`))
}
/* End MongoDB Connection Check */