const authMiddleware = require('../middlewares/auth_middleware')
const Auth = require('../controllers/auth_controller')

module.exports = (app) => {
    
    app.route('/rTsc2@12I')
        .get(Auth.getCsrf)

    app.route('/api/tokenverify')
        .get(authMiddleware, Auth.tokenVerify)

    app.route('/api/signin')
        .post(Auth.signIn)
    
    app.route('/api/signup')
        .post(Auth.signUp)

    app.route('/api/signout')
        .post(authMiddleware, Auth.signOut)
    
    app.route('/api/profile')
        .get(authMiddleware, Auth.profile)
}