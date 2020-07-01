const graphModel = require('../models/graph_model')
const mqttClient = require('../config/mqtt_client')
const env        = require('../env')
const socket     = require('socket.io-client')(`${env.socket_domain}`, {extraHeaders: {origin: `${env.domain}:${env.port}`}})

mqttClient.subscribe('sthing/device_data')
mqttClient.on('message', function (topic, message) {
    const data = JSON.parse(message.toString())

    console.log(data)
    socket.emit('graph_data', data)
})