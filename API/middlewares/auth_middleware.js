const jwt       = require('jsonwebtoken');
const env       = require('../env');
const secret    = env.token_secret;

const authMiddleware = async (req, res, next) => {
    try {
        res.setHeader( 'X-Powered-By', 'SCP' );

        const token     = req.header('Authorization').replace('Bearer ','');
        const decoded   = jwt.verify(token, secret);

        if(decoded) {
            req.token       = token;
            req.idUser      = decoded.idUser;
            req.idDevice    = decoded.idDevice;
            req.deviceName  = decoded.deviceName;

            next();
        } else {
            res.status(400).json({ status: 'Error', code: 400, msg: "Invalid Token Request."})
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(406).json({ status: 'Error', code: 406, msg: 'Not Acceptable'})
    }
}

module.exports = authMiddleware;