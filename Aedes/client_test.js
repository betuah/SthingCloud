var mqtt = require('mqtt'),
    host = 'sthing.seamolec.org',
    port = 6000

var settings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 4,
    clientId: 'Publisher 1',
    clean: true, 
    username:'OC4gnEfZf',
    password:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik9DNGduRWZaZiIsImlkVXNlciI6ImFyMXdFalR6WUNVdTJjV2V0NWpkQmhjNUdxSjMiLCJpZERldmljZSI6Ik9DNGduRWZaZiIsImRldmljZU5hbWUiOiJ3ZHF3ZCIsImlhdCI6MTU5NjY4ODczMn0.Zevsa3xFN9JcyiNkEwWMRloj5pKhzzH-zNT3gXopbRI'
}

var node_env = 'production'

// client connection
let mqttClient = mqtt.connect(`${node_env === 'production' ? 'mqtts' : 'mqtt'}://${host}:${port}`, settings)

const data = {
    graphId: 'oi7IZSGUD',
    dataId: 'tests',
    value: '31'
}

mqttClient.subscribe('OC4gnEfZf/controller', err => {
    if (!err) {
        setInterval(() => {
            console.log('push')
            mqttClient.publish('OC4gnEfZf/device_data', JSON.stringify(data), { qos: 2 })
        }, 2000)
        
    } else {
        console.log(err)
    }
})

mqttClient.on('message', function (topic, message) {
    console.log(message.toString())
    // console.log(JSON.parse(message.toString()))
})