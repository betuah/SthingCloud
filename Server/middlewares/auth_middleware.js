const jwt           = require('jsonwebtoken')
const env           = require('../env')
const secret        = env.token_secret
const firebaseAdmin = require('../config/firebaseAdminConfig')
const firebaseAuth  = firebaseAdmin.auth()

const authMiddleware = async (req, res, next) => {
    try {
        res.setHeader( 'X-Powered-By', 'SCP' )

        const token     = req.header('Authorization').replace('Bearer ','')
        const decoded   = jwt.verify(token, secret)     

        /* verify firebase token to get result user login or not */
        // firebaseAuth.verifyIdToken(decoded.refresh_token, true).then(() => {
        //     req.token   = token
        //     req.id_user = decoded.uid
        //     req.role    = decoded.roles
        //     req.uid     = decoded.uid

        //     next()
        // }).catch(err => {
        //     res.status(401).json({ status: 'UNAUTHORIZED!', code: 406, msg: "You'are not authorized to access this content!"})
        // })

        req.token   = token
        req.id_user = decoded.uid
        req.role    = decoded.roles
        req.uid     = decoded.uid

        next()
    } catch (error) {
        res.status(406).json({ status: 'Not Acceptable', code: 406, msg: "Invalid Token request."})
    }
}

module.exports = authMiddleware;