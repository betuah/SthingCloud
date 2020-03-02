const userCRUD  = require('../models/mysql/crud_model')
const jwt       = require('jsonwebtoken')
const env       = require('../env')
const secret    = env.token_secret

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

exports.activation = async (req, res) => {
    try {
        const decoded   = jwt.verify(req.params.token, secret);

        const data = {
            table: "tb_users",
            set: "status=1",
            condition: `WHERE id_users="${decoded.id}"`
        }

        userCRUD.update(data, (err, result) => {
            if(err) {
                res.status(500).send('Internal Server Error')
            } else {
                res.status(200).send(`<p>Your account is activate! <b><a href="${env.client_domain}">Click Here to Sign In</a></b></p>`)
            }
        })
    } catch (error) {
        res.status(406).json({ status: 'Error', code: 406, msg: "Invalid Token request."})
    }
}