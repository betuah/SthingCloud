const controlModel = require('../models/control_model')
const mqttClient   = require('../config/mqtt_client')
const env          = require('../env')
const socket       = require('socket.io-client')(`${env.socket_domain}`, {extraHeaders: {origin: `${env.domain}:${env.port}`}})

exports.index = (req, res) => {
    res.send('Hello world from SThing IoT Gateway :)')
}

exports.controllerData_update = async (req, res) => {
    try {
        controlModel.findOneAndUpdate({ _id: req.params.controllerId, 'controller_widget._id': req.params.widgetId }, { 
            $set: { 
                'controller_widget.$.dataValue': req.body.dataValue
            }
        })
        .then((cb) => {
            if(cb) {
                const data = cb.controller_widget.find(val => val._id === req.params.widgetId)
                
                const topic   = `${cb.userId}/${data.resourceId}/controller`
                const payload = { type: data.dataId, value: req.body.dataValue }

                mqttClient.publish(topic, JSON.stringify(payload), { qos: 2 })

                res.status(200).json({ status: 'Success', code: 200, msg:`Updating widget is success.`})
            } else {
                res.status(200).json({ status: 'Error', code: 404, msg: 'Widget not found!'})
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ status: 'Error', code: 500, msg: 'Internal Server Error!'})
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}