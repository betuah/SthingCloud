const graphModel    = require('../models/graph_model')
const usersModel    = require('../models/usersData_model')
const mqttClient    = require('../config/mqtt_client')
const redisClient   = require('../config/redis_config')
const env           = require('../env')
const uuid          = require('shortid')
const socket        = require('socket.io-client')(`${env.socket_domain}`, {extraHeaders: {origin: `${env.domain}:${env.port}`}})

redisClient.on("connect", () => {
    redisClient.flushdb((err, succeeded) => {
        if (succeeded)
            console.log('Flush Redis Data') // will be true if successfull
    })
    console.log('Connected to Redis Server')
})

redisClient.on("error", error => {
    if (error)
        console.log(error)
        redisCheck = false
})

mqttClient.subscribe('sthing/device_data')
mqttClient.on('message', async (topic, message) => {
    const deviceData = JSON.parse(message.toString())
    const generateId = `${deviceData.idUser}${deviceData.graphId}${deviceData.idDevice}${deviceData.dataId}`

    await findGraphData(deviceData).then(res => {
        const widget = res.graph_widget.find(val => val.dataId === deviceData.dataId)

        switch (true) {
            case deviceData.value > widget.settings.triggerMax.value && widget.settings.triggerMax.active === 1 : {
                    redisClient.get(`${generateId}`, (err, reply) => {
                        if (!reply || reply !== '1') {
                            redisClient.set(`${generateId}`, 1)

                            if (widget.settings.triggerMax.notif) {
                                const notifData = {
                                    userId: deviceData.idUser,
                                    notif: {
                                        status: 0,
                                        title: `${res.graph} - ${widget.widgetTitle} (Max Alert)`,
                                        message: `Data values from ${deviceData.deviceName} devices with dataId ${deviceData.dataId} has exceeded the maximum value`,
                                        read: 0
                                    }
                                }

                                socket.emit('notification', notifData )

                                setNotif(notifData).catch(err => {
                                    console.log(new Error(err))
                                })
                            } 
                            
                            if (widget.settings.triggerMax.mail) {
                                console.log('mail me max')
                            }
                        }
                    })
                break
            }
            
            case deviceData.value < widget.settings.triggerMin.value && widget.settings.triggerMin.active === 1 : {
                    redisClient.get(`${generateId}`, (err, reply) => {
                        if (!reply || reply !== '2') {
                            redisClient.set(`${generateId}`, 2)
                            if (widget.settings.triggerMin.notif) {
                                const notifData = {
                                    userId: deviceData.idUser,
                                    notif: {
                                        status: 0,
                                        title: `${res.graph} - ${widget.widgetTitle} (Min Alert)`,
                                        message: `Data values from ${deviceData.deviceName} devices with dataId ${deviceData.dataId} has exceeded the minimum value`,
                                        read: 0
                                    }
                                }

                                socket.emit('notification', notifData )

                                setNotif(notifData).catch(err => {
                                    console.log(new Error(err))
                                })
                            } 
                            
                            if (widget.settings.triggerMin.mail) {
                                console.log('mail me min')
                            }
                        }
                    })
                break
            }

            default : {
                redisClient.get(`${generateId}`, (err, reply) => {

                    if(reply) {
                        if(reply === '1' || reply === '2') {
                            if (widget.settings.triggerMax.notif || widget.settings.triggerMin.notif) {
                                const notifData = {
                                    userId: deviceData.idUser,
                                    notif: {
                                        status: 1,
                                        title: `${res.graph} - ${widget.widgetTitle} (Return Normal)`,
                                        message: `Data values from ${deviceData.deviceName} devices with dataId ${deviceData.dataId} has return to normal`,
                                        read: 0
                                    }
                                }

                                socket.emit('notification', notifData )

                                setNotif(notifData).catch(err => {
                                    console.log(new Error(err))
                                })
                            } 
                            
                            if (widget.settings.triggerMax.mail || widget.settings.triggerMin.mail) {
                                console.log('mail me normal')
                            }
                        }
                        redisClient.del(`${generateId}`)
                    }
                })
                break
            }
        }
    }).catch(err => console.log(err))

    await setDataValue(deviceData).catch(err => {
        console.log(err)
    })
    socket.emit('graph_data', deviceData)
})


const findGraphData = (data) => new Promise((resolve, reject) => {
    graphModel.findOne({ 
        _id: data.graphId, 
        userId: data.idUser
    }).then((data) => {
        return resolve(data)           
    }).catch((err) => {
        return reject(new Error(err))
    })
})

const setDataValue = (data) => new Promise((resolve, reject) => {
    graphModel.findOneAndUpdate({ _id: data.graphId, userId: data.idUser, 'graph_widget.dataId': data.dataId }, { 
        $set: { 
            'graph_widget.$.dataValue': parseInt(data.value) || 0
        }
    })
    .then((cb) => {
        if(cb) {
            return resolve(cb)
        } else {
            return reject(new Error('Data Not Found'))
        }
    })
    .catch(err => {
        return reject(new Error('Failed update data value'))
    })
})

const setNotif = (data) => new Promise((resolve, reject) => {
    usersModel.findOneAndUpdate({ userId: data.userId }, { 
        $push: { notif: {
            ...data.notif
        }}
    })
    .then((cb) => {
        if(cb) {
            resolve(cb)
        } else {
            reject(new Error('User not found in setNotif'))
        }
    })
    .catch((err) => {
        console.log(new Error(err))
        reject(err)
    })
})

const setLog = (data) => new Promise((resolve, reject) => {
    usersModel.findOneAndUpdate({ userId: data.userId }, { 
        $push: { notif: {
            ...data.log
        }}
    })
    .then((cb) => {
        if(cb) {
            resolve(cb)
        } else {
            reject(new Error('User not found in setLog'))
        }
    })
    .catch((err) => {
        console.log(new Error(err))
        reject(err)
    })
})