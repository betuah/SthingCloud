const Aedes     = require('aedes')()
const server    = require('net').createServer(Aedes.handle)
const env       = require('./env')
const socket    = require('socket.io-client')(`${env.socket_domain}`, {extraHeaders: {origin: `${env.domain}:${env.port}`}})
const auth      = require('./controllers/auth')
const port      = env.port || 1883
const admin_user = '@dm1n'

Aedes.on('clientReady', client => {
    console.log('Client connected :', client.id)
})

Aedes.on('publish', (packet, client) => {
    if (client) {
        console.log('Publisher :', client.id)
    }
})

Aedes.on('subscribe', (subscriptions, client) => {
    if (client && client.id.split('.')[0] !== admin_user ) {
        const clientData = {
            idUser : client.idUser,
            idDevice : client.deviceId,
            deviceName : client.deviceName,
            deviceStatus : 1
        }
    
        socket.emit('device_connect', clientData)

        console.log('Subscriber', client.id)
    }
})

Aedes.on('unsubscribe', (unsubscriptions, client) => {
    if (client && client.id.split('.')[0] !== admin_user ) {
        const clientData = {
            idUser : client.idUser,
            idDevice : client.deviceId,
            deviceName : client.deviceName,
            deviceStatus : 0
        }
    
        socket.emit('device_connect', clientData)

        console.log('Unsubscriber', client.id)
    }
})

Aedes.on('clientDisconnect', client => {
    console.log('Client Disconnect :', client.id)
})

const setup = () => {
    Aedes.authenticate       = auth.authenticate
    Aedes.authorizePublish   = auth.authorizePublish
    Aedes.authorizeSubscribe = auth.authorizeSubscribe

    console.log(`MQTT Broker (AEDES) server is running up on port ${env.port}`)
}

server.listen(port, setup)