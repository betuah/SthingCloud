var mqtt = require('mqtt'),
    host = 'localhost',
    port = 6000

var settings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 4,
    clientId: 'Publisher 1',
    clean: true, 
    username:'IF1jvzZsy',
    password:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IklGMWp2elpzeSIsImlkVXNlciI6Ik14WkRmUzJtWWpnWVJDUFpTS1gyZHFHazZoaDEiLCJpZERldmljZSI6IklGMWp2elpzeSIsImRldmljZU5hbWUiOiJEZXZpY2UgQSIsImlhdCI6MTU5MzUwNzk1M30.IeZDmsxBYvADwuOeoR6cZBMBPOJxQ1vW_oMyyfQy4Sc'
}

// client connection
let mqttClient = mqtt.connect(`mqtt://${host}:${port}`, settings)

const data = {
    dataId: 'test',
    value: 50
}

mqttClient.subscribe('IF1jvzZsy/controller', err => {
    if (!err) {
        setInterval(() => mqttClient.publish('IF1jvzZsy/device_data', JSON.stringify(data), { qos: 2 }), 1000)
        
    }
})

mqttClient.on('message', function (topic, message) {
    console.log(message.toString())
    // console.log(JSON.parse(message.toString()))
})