var mqtt = require('mqtt'),
    host = '172.32.69.12',
    port = 1883

var settings = {
    // keepalive: 1000,
    // protocolId: 'MQIsdp',
    // protocolVersion: 4,
    // clientId: 'Publisher 1',
    // clean: true, 
    username:'zROP3U3vi',
    password:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InpST1AzVTN2aSIsImlkVXNlciI6IlZLek5JMFpPQmFoT01OVjhWcUNOSTlVQWQwZzIiLCJpZERldmljZSI6InpST1AzVTN2aSIsImRldmljZU5hbWUiOiJtb2RlIiwiaWF0IjoxNTk3MDQwMTc4fQ.6SX6y7RIc04U-3EPV_Zkrr3xVJf8gmWtOD9r4DNdenw'
}

var node_env = 'dev'

// client connection
let mqttClient = mqtt.connect(`${node_env === 'production' ? 'mqtts' : 'mqtt'}://${host}:${port}`, settings)

const data = {
    graphId: 'XFDx7Ej2C',
    dataId: '123',
    value: '80'
}

mqttClient.subscribe('zROP3U3vi/controller', err => {
    if (!err) {
        setInterval(() => {
            console.log('push')
            mqttClient.publish('zROP3U3vi/device_data', JSON.stringify(data), { qos: 2 })
        }, 2000)
        
    } else {
        console.log(err)
    }
})

mqttClient.on('message', function (topic, message) {
    console.log(message.toString())
    // console.log(JSON.parse(message.toString()))
})