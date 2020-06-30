const jwt      = require('jsonwebtoken')
const env      = require('../env')
const bcrypt   = require('bcrypt')
const uuid     = require('uuid')
const secret   = env.token_secret

const admin_user = '@dm1n'

exports.authenticate = (client, username, token, callback) => {
    if (username === admin_user) {
        const decode = bcrypt.compare(`${env.token_secret}`, `${token}`)
        if (decode) {
            client.id  = `${username}.${uuid()}`
            callback(null, true)
        } else {
            callback(null, false)
        }
    } else {
        try {
            /* Check if token is valid */
            const decode = jwt.verify(token.toString(), secret) // Decode token payload
            const authorized = decode && true
    
            if (authorized && username === decode.idDevice) // If Token Valid
                /* Start set client data */
                client.id           = `${decode.idUser}.${username}`
                client.idUser       = decode.idUser
                client.deviceId     = decode.idDevice
                client.deviceName   = decode.deviceName
                /* End set client data */
            callback(null, true) // Return true
        } catch (error) {
            /* Handle error if token not valid */
            callback(null, false) // Return false
        }
    }
}
  
/* 
    In this case the client authorized can publish to userid/deviceId/topic taking
    the deviceId from the topic and verifing it is the same of the authorized deviceId
*/
exports.authorizePublish = (client, packet, callback) => {
    if (client.id.split('.')[0] === admin_user) {
        callback(null, true)
    } else if (client.deviceId == packet.topic.split('/')[0]) {
        packet.topic = `${client.idUser}/${packet.topic}`
        callback(null, true)
    } else {
        return callback(new Error(`Not authorized to publish!`))
    }
}

/* 
    In this case the client authorized can publish to userid/deviceId/topic taking
    the deviceId from the topic and verifing it is the same of the authorized deviceId
*/
exports.authorizeSubscribe = (client, sub, callback) => {
    if (sub.topic.split('/')[0] === client.deviceId) {
        // overwrites subscription
        sub.topic = `${client.idUser}/${sub.topic}`
        sub.qos = 2
        callback(null, sub)
    } else {
        return callback(new Error(`Not authorized to subscribe!`))
    }
}