const graph    = require('../models/mongoDB/graph_model')
const uuid     = require('shortid')
const jwt      = require('jsonwebtoken')
const env      = require('../env')

exports.index = async (req, res) => {
    try {
        DeviceData.find({ _idUsers: req.id_user }).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(500).json({ status: "Error", code: "500", msg: "Internal Server Error"})
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
};

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
                            data        : [],
                            "lastConn"  : null,
                            "state"     : 0	                        
                        }
                  
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.findOne = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.edit = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.delete = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.widget_create = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}
