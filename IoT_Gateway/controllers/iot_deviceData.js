const graphModel    = require('../models/graph_model')
const notifModel    = require('../models/notif_model')
const usersModel    = require('../models/usersData_model')
const transporter   = require('../config/mail_config')
const mqttClient    = require('../config/mqtt_client')
const redisClient   = require('../config/redis_config')
const hash          = require('../config/hash_config')
const env           = require('../env')
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
        console.log(new Error(error))
        redisCheck = false
})

mqttClient.subscribe('sthing/device_data')
mqttClient.on('message', async (topic, message) => {
    const deviceData = JSON.parse(message.toString())
    const generateId = `${deviceData.idUser}${deviceData.graphId}${deviceData.idDevice}${deviceData.dataId}`

    await findGraphData(deviceData).then(res => {
        const widget = res.graph_widget.find(val => val.dataId === deviceData.dataId)

        switch (true) {
            case Number(deviceData.value) > widget.settings.triggerMax.value && widget.settings.triggerMax.active === 1 : {
                    redisClient.get(`${generateId}`, (err, reply) => {
                        if (!reply || reply !== '1') {
                            redisClient.set(`${generateId}`, 1)

                            if (widget.settings.triggerMax.notif) {
                                const notifData = {
                                    userId: deviceData.idUser,
                                    notif: {
                                        status: 1,
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
                                findUserData(deviceData.idUser).then(res => {
                                    sendMail({ 
                                        ...res.smtp, 
                                        ...deviceData,
                                        graphName: widget.widgetTitle,
                                        status: 1, 
                                        mailList: widget.settings.triggerMax.mailList
                                    }).catch(err => {
                                        console.log(new Error(err))
                                    })
                                }).catch(err => {
                                    console.log(new Error(err))
                                })
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
                                        status: 2,
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
                                findUserData(deviceData.idUser).then(res => {
                                    sendMail({ 
                                        ...res.smtp, 
                                        ...deviceData,
                                        graphName: widget.widgetTitle,
                                        status: 2, 
                                        mailList: widget.settings.triggerMin.mailList
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                }).catch(err => {
                                    console.log(new Error(err))
                                })
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
                                        status: 0,
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
                                findUserData(deviceData.idUser).then(res => {
                                    let mailingList = reply === '1' ? widget.settings.triggerMax.mailList : widget.settings.triggerMin.mailList
                                    
                                    sendMail({ 
                                        ...res.smtp, 
                                        ...deviceData,
                                        graphName: widget.widgetTitle,
                                        status: 0, 
                                        mailList: mailingList
                                    }).catch(err => {
                                        console.log(new Error(err))
                                    })
                                }).catch(err => {
                                    console.log(new Error(err))
                                })
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

const findUserData = (idUser) => new Promise((resolve, reject) => {
    usersModel.findOne({ 
        userId: idUser
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
    notifModel.create(data)
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

const sendMail = (data) => new Promise((resolve, reject) => {
    console.log('test')
    const mailSettings = {
        host: `${data.host}`,
        port: data.port,
        secure: data.secure ? true : false,
        username: `${data.username}`,
        password: `${data.password ? hash.decrypt(data.password) : ''}`,
        tls: data.tls ? true : false
    }
    
    let maxContent = `Data values from ${data.deviceName} devices with dataId ${data.dataId} has exceeded the maximum value. Current value is ${data.value}`
    let minContent = `Data values from ${data.deviceName} devices with dataId ${data.dataId} has exceeded the minimum value. Current value is ${data.value}`
    let normalContent = `Data values from ${data.deviceName} devices with dataId ${data.dataId} has return to normal. Current value is ${data.value}`

    const fromObject = {
        name: 'SThing - IoT Cloud Platform',
        address: `${data.username}`
    }

    const mailOptions = {
        from: fromObject,
        to: `${data.mailList}`,
        subject: `Alert Report ${data.status === 1 ? 'Max Value' : (data.status === 2 ? 'Min Value' : 'Return Normal') } (${data.graphName})`,
        html: data.status === 1 ? maxContent : (data.status === 2 ? minContent : normalContent)
    }
    
    transporter(mailSettings).sendMail(mailOptions, (err, info) => {
        if (err) {
            reject(new Error(err))
        } else {
            resolve(true)
        }
    })
})