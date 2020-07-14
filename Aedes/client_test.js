var mqtt = require('mqtt'),
    host = 'localhost',
    port = 6000

var settings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 4,
    clientId: 'Publisher 1',
    clean: true, 
    username:'C6AWnGJDq',
    password:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkM2QVduR0pEcSIsImlkVXNlciI6Ik1ieFNHVXR5QWFQdWthOU54MEh4aWhWWVN5TDIiLCJpZERldmljZSI6IkM2QVduR0pEcSIsImRldmljZU5hbWUiOiJEZXZpY2UgVGVzdCAwMSIsImlhdCI6MTU5NDYxODc0Mn0.XjKatEqSjn5rF7LsXzo3fsy1Fpo5C3NGfFeJmEpkcEM'
}

// client connection
let mqttClient = mqtt.connect(`mqtt://${host}:${port}`, settings)

const data = {
    graphId: 'KKJ4QDpjW',
    dataId: 'test',
    value: '91'
}

mqttClient.subscribe('C6AWnGJDq/controller', err => {
    if (!err) {
        setInterval(() => {
            console.log('push')
            mqttClient.publish('C6AWnGJDq/device_data', JSON.stringify(data), { qos: 2 })
        }, 200)
        
    }
})

mqttClient.on('message', function (topic, message) {
    console.log(message.toString())
    // console.log(JSON.parse(message.toString()))
})