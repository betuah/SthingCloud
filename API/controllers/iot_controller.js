// const iotData   = require('../models/iotData_model');
const controlModel = require('../models/control_model')
const env          = require('../env')
const moment       = require('moment')
const tz           = require('moment-timezone')
let socket         = require('socket.io-client')(`${env.socket_domain}`, {extraHeaders: {origin: `${env.domain}:${env.port}`}})

const curentTime = moment()
let dataTmp = []

// setInterval(() => {
//     // const curentTime = moment()

//     dataTmp.map((item, index) => {
//         console.log(item)
//     })
    
// }, 2000)

exports.index = (req, res) => {
    res.send('Iot API @ SEAMOLEC Cloud Platform')
}

exports.getData = async (req, res) => {
    try {
        controlModel.findOne({ 
            _id: req.params.controllerId, 
            userId: req.idUser
        }).then((datas) => {
            if(datas) {
                const data = datas.controller_widget.find(n => n.dataId === `${req.params.dataId}` && n.resourceId === `${req.idDevice}`)
                res.status(200).json(data === '' || null ? "Not Found!" : data.dataValue);
            } else {
                res.status(404).json({ status: 'Error', code: 404, msg: 'Not Found!'})
            }            
        }).catch((err) => {
            console.log(err)
            res.status(400).json({ status: 'Error', code: 500, msg: 'Internal Server Error' })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.data = async (req, res) => {
    try {
        if(req.body.type && req.body.value) {
            const data = {
                idUser : req.idUser,
                idDevice : req.idDevice,
                deviceName : req.deviceName,
                ...req.body
            }

            const dataIndex = dataTmp.findIndex(e => e.idUser === data.idUser & e.idDevice === data.idDevice & e.type === data.type) // Get index of device in array

            if ( dataIndex !== -1 ) {
                const e = dataTmp[dataIndex]
                dataTmp[dataIndex] = {...data, curentTime: curentTime}
            } else {
                dataTmp.push({...data, curentTime: curentTime})
            }

            socket.emit('device_connect', data);
            socket.emit('graph_data', data);
            res.send('Data received!')
        } else {
            res.status(400).json({
                status: 'Bad Request',
                code: 400,
                msgs: "Please fill the data required! Note: Attention to case sensitive!",
                data: {
                    type: {
                        type: 'String',
                        required: true
                    },
                    value: {
                        type: 'Number',
                        required: true
                    }
                }
            })
        }
        
        // const type  = req.body.type ? req.body.type : null
        // const value = req.body.value ? req.body.value : null

        // if (type && value ) { 
        //     const data  = {
        //         type: type,
        //         value: value
        //     }

        //     iotData.findOneAndUpdate({ _id: req.idDevice }, { 
        //         $addToSet: { data: {
        //             ...data
        //         }}
        //     })
        //     .then((cb) => {
        //         if(cb) {
        //             res.status(200).json({ status: 'Success', code: 200, msg:`Success insert data with id device ${cb._id} and device name ${cb.device}`})
        //         } else {
        //             res.status(404).json({ status: 'Error', code: 404, msg: 'Device not found!'})
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //         res.status(500).json({ status: 'Error', code: 500, msg: 'Internal Server Error!'})
        //     });
        // } else {
        //     res.status(400).json({ status: 'Error', code: 400, msg: 
        //         { 
        //             DATA_REQUIRED: { 
        //                 type: { 
        //                     required: true, 
        //                     unique: true, 
        //                     type: 'String' 
        //                 },
        //                 value: {
        //                     required: true, 
        //                     unique: false, 
        //                     type: 'Number'
        //                 }
        //             } 
        //         }
        //     })
        // }
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 'Error', code: 500, msg: 'Internal Server Error!'})
    }
}