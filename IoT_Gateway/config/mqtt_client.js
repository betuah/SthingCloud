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

const mqttClient = mqtt.connect(env.node_env === 'production' ? `mqtts://${env.mqtt_broker_host}:${env.mqtt_broker_port}` : `mqtt://${env.mqtt_broker_host}:${env.mqtt_broker_port}`, settings)

console.log(env.node_env === 'production' ? `mqtts://${env.mqtt_broker_host}` : `mqtt://${env.mqtt_broker_host}`)
// mqttClient.subscribe('device_data')

module.exports = mqttClient