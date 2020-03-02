const authMiddleware = require('../middlewares/auth_middleware');
const Iot = require('../controllers/iot_controller');

module.exports = (app) => {
    
    app.route('/api/iot')
        .post(authMiddleware, Iot.data);
};