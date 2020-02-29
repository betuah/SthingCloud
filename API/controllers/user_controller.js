const userCRUD    = require('../models/mysql/crud_model');

exports.index = async (req, res) => {
    try {
        const data = {
            table: "v_users"
        }
    
        if (req.role === '2' ) {
            res.status(401).send({error: 401, msg: "You're not authorized!"});
        } else {
            userCRUD.findAll(data, (err, result) => {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(result);
                }
            });
        }
    } catch (error) {
        res.status(500).send()
    }
};

exports.findUsers = async (req, res) => {
    
    const id_val    = req.query.id ? req.query.id : (req.body.id ? req.body.id : req.params.id);
    const tb        = "v_users";

    const data = {
        table: tb,
        column: 'id_users',
        values: id_val
    }

    if (req.role === '2' ) {
        res.status(401).send({error: 401, msg: "You're not authorized!"});
    } else {
        userCRUD.findOne(data, (err, result) => {
            if(err) {
                res.status(500).json(err);
            } else {
                if(result.data === null) {
                    const dataRes = {
                    status: result.status,
                    code: result.code,
                    msg: result.msg
                    }
                    res.status(result.code).json(dataRes);
                } else {
                    res.status(200).json(result);
                }            
            }
        });
    }
};