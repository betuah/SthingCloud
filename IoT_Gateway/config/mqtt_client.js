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
    clean: false, 
    clientId: '@dm1n',
    username:'@dm1n',
    password:`${mqttTokenAdmin}`
}

const mqttClient = mqtt.connect(`${env.mqtt_broker_domain}`, settings)

module.exports = mqttClient