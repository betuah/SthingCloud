const jwt           = require('jsonwebtoken')
const env           = require('../env')
const bcrypt        = require('bcrypt')
const secret        = env.token_secret

const authMiddleware = async (req, res, next) => {
    try {
        res.setHeader( 'X-Powered-By', 'SThing.seamolec.org' )

        const token     = req.header('Authorization').replace('Bearer ','')
        const decoded   = jwt.verify(token, secret)     

        const userRoles = await bcrypt.compare('1', decoded.roles)

        req.token   = token
        req.id_user = decoded.uid
        req.role    = userRoles ? 1 : false
        req.uid     = decoded.uid

        next()
    } catch (error) {
        res.status(406).json({ status: 'Not Acceptable', code: 406, msg: "Invalid Token request."})
    }
}

module.exports = authMiddleware;