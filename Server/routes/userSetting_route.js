const authMiddleware    = require('../middlewares/auth_middleware')
const UserSetting       = require('../controllers/userSetting_controller')

module.exports = (app) => {

    app.route('/api/user/settings')
        .get(authMiddleware, UserSetting.index)

    app.route('/api/user/settings')
        .post(authMiddleware, UserSetting.update)

    app.route('/api/user/avatar/upload')
        .post(authMiddleware, UserSetting.avatarUpload)

    app.route('/api/user/sendtestmail')
        .post(authMiddleware, UserSetting.sendTestMail)
}