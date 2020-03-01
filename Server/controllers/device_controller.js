const Device    = require('../models/mongoDB/device_model');
const uuid      = require('shortid');
const jwt       = require('jsonwebtoken');
const env       = require('../env');

exports.index = async (req, res) => {
    try {
        Device.find({ _idUsers: req.id_user }).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(500).json({ status: "Error", code: "500", msg: "Internal Server Error"})
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
};

exports.generateToken = async (req, res) => {
    try {
        const token     = jwt.sign({ _id: `${id}`, _roles: `${role}`}, secret, { expiresIn: '1h' });
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
} 

exports.create = async (req, res) => {
    try {
        const id        = uuid.generate();
        const secret    = env.token_secret;
        const token     = jwt.sign({ id: `${id}`, idUser: `${req.id_user}`, idDevice: `${id}`}, secret);
        const body      = req.body
        const dataBody       = { 
                            _id         : id,
                            _idUsers    : req.id_user,
                            ...body,
                            token       : token,
                            "lastConn"  : null,
                            "state"     : 0	                        
                        }

        Device.create(dataBody).then((data) => {
            res.status(201).json({ status: "Success", code: 201, msg: "Success insert data.", data: data});
        }).catch((err) => {
            res.status(400).json({ status: 'Error', code: err.code ? err.code : 400, msg: err.code === 11000 ? 'Duplicate Device Name!' : 'Failed Saving Data. Please fill all required fields!' })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.findOne = async (req, res) => {
    try {
        Device.findById({ _id: req.params.id, _idUsers: req.id_user}).then((data) => {
            if(data) {
                res.status(202).json(data);
            } else {
                res.status(404).json({ status: 'Error', code: 404, msg: 'Device Not Found!'})
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

exports.delete = async (req, res) => {
    try {
        Device.deleteMany({ _id: req.body.id })
        .then(data => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ status: 'Error', code: 400, msg: err })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}
