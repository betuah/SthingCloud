const authMiddleware = require('../middlewares/auth_middleware');
const Auth = require('../controllers/auth_controller');

module.exports = (app) => {
    
    app.route('/api/signin')
        .post(Auth.signIn);
    
    app.route('/api/signup')
        .post(Auth.signUp);
    
    app.route('/api/profile')
        .get(authMiddleware, Auth.profile);
};