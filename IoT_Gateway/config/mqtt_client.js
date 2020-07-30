const mqtt           = require('mqtt')
const bcrypt         = require('bcrypt')
const env            = require('../env')

const saltRounds     = 10
const salt           = bcrypt.genSaltSync(saltRounds)
const mqttTokenAdmin = bcrypt.hashSync(`${env.mqtt_admin_secret}`, salt)

const settings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 4,
    clean: true, 
    clientId: '@dm1n',
    username:'@dm1n',
    password:`${mqttTokenAdmin}`
}

const mqttClient = mqtt.connect(`mqtt://${env.mqtt_broker_host}`, settings)

// mqttClient.subscribe('device_data')

module.exports = mqttClient