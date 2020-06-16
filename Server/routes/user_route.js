const authMiddleware = require('../middlewares/auth_middleware')
const User = require('../controllers/user_controller')

module.exports = (app) => {
    
    app.route('/api/user/avatar/upload')
        .post(authMiddleware, User.avatarUpload)
}