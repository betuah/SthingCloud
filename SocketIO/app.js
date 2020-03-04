const   express         = require("express"),
        http            = require("http"),
        socketIo        = require("socket.io"),
        moment          = require('moment'),
        iotDeviceModel  = require('./models/device_model');

//Setting Up environment
require('dotenv').config();

//Setting up express and adding socketIo middleware
const app       = express()
const server    = http.createServer(app)
const io        = socketIo(server)
const url       = 'http://localhost'
const port      = process.env.PORT || 4001 //Port from environment variable or default - 4001

/* Socket IO */

// Allow origins
// io.origins([`${process.env.CLIENT_DOMAIN}`,`${process.env.SERVER_DOMAIN}`,`${process.env.API_DOMAIN}`])

// Array device
let tmp = []

io.on("connection", socket => {
    console.log("New Client connected");

    // Create Room to each user connected
    socket.on('join_room', room => {
        console.log(`userID ${room} has joined room!`);
        socket.join(room);
        io.sockets.in(room).emit('receive_broadcast', {
            message: `You're joined to ${room} room!`
        });
    });

    // Event to receive data from iot device
    socket.on("device_connect", data => {
        const curentTime = moment() // Set current time
        const tmpData = {
            curentTime: curentTime,
            ...data // Receive data from API device
        }

        const isIndex = tmp.findIndex(e => e.idDevice && (e.idDevice === data.idDevice)) // Get index of device in array

        if(isIndex !== -1) { // If device found in array
            tmp[isIndex].curentTime = curentTime // Will set curent time to existing array
        } else { // Else device not found in array

            let err = 0

            tmp.push(tmpData) // Adding new device to array

            // Change state to 1 mean connected
            iotDeviceModel.findByIdAndUpdate({ _id: data.idDevice }, { $set: { state: 1 }})
            .catch(err => {
                err = 1
                console.log(err)
            })

            // Get count device connected in spesific userID            
            getDeviceConn = tmp.filter(val => val.idUser ? (val.idUser.match(data.idUser) ? val : '') : '')

            // Tell client that device status was change
            io.sockets.in(data.idUser).emit('event', {
                statusChange: 1,
                onlineDevice: getDeviceConn.lenght,
                error: err
            });     
        }
    })

    // Check each second for get device time out infomation
    setInterval(function(){ 
        const intervalCurentTime = moment() // Set current time
        
        tmp.forEach((item, index) => { // Check every index in array
            const timeOut = moment.duration(intervalCurentTime.diff(item.curentTime)).asMinutes() // Get device time out
            if (timeOut > 1) { // Check that the device has timed out not more than 1 minute

                let err = 0
                
                // Change status to 0 mean disconnected
                iotDeviceModel.findByIdAndUpdate({ _id: item.idDevice }, { $set: { state: 0 }})
                .catch(err => {
                    err = 1
                    console.log(err)
                })

                // Get count device connected in spesific userID
                getDeviceConn = tmp.filter(val => val.idUser ? (val.idUser.match(item.idUser) ? val : '') : '')

                // Tell client that device status was change
                io.sockets.in(item.idUser).emit('event', {
                    statusChange: 0,
                    onlineDevice: getDeviceConn.lenght,
                    error: err
                });   
                
                // Remove offline device from array
                tmp.splice(index, 1);
            }
        })
    }, 1000);

    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
});

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    server.listen(port, () => console.log(`Socket IO Server listen on port ${port}`));
} else {
    console.log("MongoDB Not Connected!")
}
/* End MongoDB Connection Check */