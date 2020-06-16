const authMiddleware = require('../middlewares/auth_middleware')
const device = require('../controllers/device_controller')

module.exports = (app) => {   

    app.route('/api/device')
        .get(authMiddleware, device.index)

    app.route('/api/device')
        .post(authMiddleware, device.create)

    app.route('/api/device')
        .delete(authMiddleware, device.delete)
    
    app.route('/api/device/:id')
        .get(authMiddleware, device.findOne)
        
    app.route('/api/device/generatetoken')
        .post(authMiddleware, device.generateToken)
};