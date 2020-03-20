const iotData   = require('../models/iotData_model');
let socket      = require('socket.io-client')('http://127.0.0.1:4001');

exports.index = (req, res) => {
    res.send('Holla')
}

exports.data = async (req, res) => {
    try {
        
        const data = {
            idUser : req.idUser,
            idDevice : req.idDevice
        }
        socket.emit('device_connect', data);
        res.send('terkirim')
        
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