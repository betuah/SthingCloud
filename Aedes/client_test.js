var mqtt = require('mqtt'),
    host = 'sthing.seamolec.org',
    port = 6000

var settings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 4,
    clientId: 'Publisher 1',
    clean: true, 
    username:'XTIn70jU0',
    password:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlhUSW43MGpVMCIsImlkVXNlciI6ImlKQVVjS0c2amxOUGd3QTRKTHhmMGYxZWZsSjIiLCJpZERldmljZSI6IlhUSW43MGpVMCIsImRldmljZU5hbWUiOiJpb3QiLCJpYXQiOjE1OTY2ODg2MTh9.ZI7r7tx04n54vCum4595dnZ2baPCpSsLlLIphcwofPg'
}

var node_env = 'production'

// client connection
let mqttClient = mqtt.connect(`${node_env === 'production' ? 'mqtts' : 'mqtt'}://${host}:${port}`, settings)

const data = {
    graphId: 'oi7IZSGUD',
    dataId: 'tests',
    value: '31'
}

mqttClient.subscribe('XTIn70jU0/controller', err => {
    if (!err) {
        setInterval(() => {
            console.log('push')
            mqttClient.publish('XTIn70jU0/device_data', JSON.stringify(data), { qos: 2 })
        }, 2000)
        
    } else {
        console.log(err)
    }
})

mqttClient.on('message', function (topic, message) {
    console.log(message.toString())
    // console.log(JSON.parse(message.toString()))
})