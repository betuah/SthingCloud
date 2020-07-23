var mqtt = require('mqtt'),
    host = 'localhost',
    port = 6000

var settings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 4,
    clientId: 'Publisher 1',
    clean: true, 
    username:'QQ2J8IiDF',
    password:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlFRMko4SWlERiIsImlkVXNlciI6InRxZDZBUnBUWFRoNFQxZVZoOUJHSUNteHhQODIiLCJpZERldmljZSI6IlFRMko4SWlERiIsImRldmljZU5hbWUiOiJTZW5zb3IgQSIsImlhdCI6MTU5NTQ5NTk4NX0.h8vHaA6qYMt0o36X4qfI3li-0CUjOIT7oAAJxbLrcTM'
}

// client connection
let mqttClient = mqtt.connect(`mqtt://${host}:${port}`, settings)

const data = {
    graphId: 'd0Kphl9DI',
    dataId: 'testa',
    value: '31'
}

mqttClient.subscribe('QQ2J8IiDF/controller', err => {
    if (!err) {
        setInterval(() => {
            console.log('push')
            mqttClient.publish('QQ2J8IiDF/device_data', JSON.stringify(data), { qos: 2 })
        }, 2000)
        
    }
})

mqttClient.on('message', function (topic, message) {
    console.log(message.toString())
    // console.log(JSON.parse(message.toString()))
})