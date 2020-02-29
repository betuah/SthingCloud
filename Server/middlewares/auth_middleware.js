const jwt       = require('jsonwebtoken');
const env       = require('../env');
const userModel = require('../models/mysql/crud_model');
const secret    = env.token_secret;

const authMiddleware = async (req, res, next) => {
    try {
        res.setHeader( 'X-Powered-By', 'SEA Cloud Platform' );

        const token     = req.header('Authorization').replace('Bearer ','');
        const decoded   = jwt.verify(token, secret);

        const data = {
            table: 'tb_users',
            column: 'id_users',
            values: decoded._id
        }

        userModel.findOne(data, (err, result) => {
            if(err) {
                res.status(401).send({ error: "You're not authenticated!"});
                console.log(err);
            } else {
                req.token   = token;
                req.id_user = decoded._id;
                req.role    = decoded._roles;

                next();
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'Error', code: 400, msg: "Invalid Token request."})
    }
}

module.exports = authMiddleware;