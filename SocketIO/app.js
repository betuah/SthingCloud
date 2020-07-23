const   express         = require("express"),
        http            = require("http"),
        socketIo        = require("socket.io"),
        env             = require('./env'),
        iotDeviceModel  = require('./models/device_model')

/* Setting up express and adding socketIo middleware */
const app       = express()
const server    = http.createServer(app)
const io        = socketIo(server)
const port      = env.port || 4000 //Port from environment variable or default - 4000

/* Socket IO */
const whitelist = [`${env.iot_gateway_domain}`,`${env.client_domain}`, `${env.client_domain_prod}`,`${env.mqtt_broker_domain}`]
io.origins((origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        return callback('Origin not allowed from socket!', false)
    }
})

io.on("connection", socket => {
    // console.log("New Client connected"); 
    socket.on("connect", () => console.log("New client connected"))

    /* Create Room to each user connected */
    socket.on('join_room', room => {
        console.log(`${room} has joined to room ${room}!`);
        socket.join(room);
        io.sockets.in(room).emit('receive_broadcast', {
            message: `You're joined to ${room} room!`
        })
    })

    socket.on("graph_data", data => {
        // console.log(data)
        io.sockets.in(data.idUser).emit(`${data.idDevice}-${data.dataId}`, {
            value: data.value
        })
        // console.log(io.sockets.adapter.rooms)
    })

    socket.on("notification", data => {
        // console.log('notif', data)
        io.sockets.in(data.userId).emit('notif_event', {
            ...data
        })
        // console.log(io.sockets.adapter.rooms)
    })

    /* Event to receive data from Mosca Server */
    socket.on("device_connect", data => {
        let err = null

        // Change state to 1 mean connected 
        // Update device status in database
        iotDeviceModel.findByIdAndUpdate({ _id: data.idDevice }, { $set: { state: data.deviceStatus }})
        .catch(error => {
            // Handle if update to database error
            err = error // Set error to err variable
            console.log("Something error in device_connect Function SocketIO", error) // Show error log in console
        })

        /* Tell client that device status was change */
        io.sockets.in(data.idUser).emit('event', {
            statusChange: data.deviceStatus,
            device: data.deviceName,
            error: err
        })
    })
})

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    server.listen(port, () => console.log(`Socket IO listen on ${env.domain}:${env.port}`))
} else {
    console.log(`${env.domain}:${env.port} cannot connect to MongoDB!`)
}
/* End MongoDB Connection Check */