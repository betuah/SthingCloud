const express = require('express'),
    app         = express(),
    cors        = require('cors'),
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    env         = require('./env'),
    port        = env.port || 8000

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Dynamic CORS */
const whitelist = [`${env.client_domain}`]

const options = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback("CORS Not allowed by SEA Cloud Platform SERVER API'S", false)
            // console.log(callback(new Error("Not allowed by SEA Cloud Platform API'S")));
        }
    }
}

app.use('/public', express.static(__dirname + '/public'))
app.use(cors(options))
/* End Dynamic CORS */

/* Start of Routing Import */
const authRoute        = require('./routes/auth_route')
const deviceRoute      = require('./routes/device_route')
const graphRoute       = require('./routes/graph_route')
const controlRoute     = require('./routes/control_route')
const userSettingRoute = require('./routes/userSetting_route')

authRoute(app)
deviceRoute(app)
graphRoute(app)
controlRoute(app)
userSettingRoute(app)
/* End of Routing Import */

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    app.listen(port, () => console.log(`Server API listen on ${env.domain}:${env.port}`));
} else {
    console.log(`${env.domain}:${env.port} cannot connect to MongoDB!`)
}
/* End MongoDB Connection Check */