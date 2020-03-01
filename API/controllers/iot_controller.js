const iotData   = require('../models/iot_model');
const jwt       = require('jsonwebtoken');
const env       = require('../env');

exports.index = (req, res) => {
    res.send('Holla')
}

exports.temperature = async (req, res) => {
    try {
        const data = { 
            idUser: req.idUser,
            idDevice: req.idDevice,
            ...req.body
        }

        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ status: 'Error', code: 400, msg: 'Bad Request!'})
    }
}