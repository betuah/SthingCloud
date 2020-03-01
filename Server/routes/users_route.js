const authMiddleware = require('../middlewares/auth_middleware');
const user = require('../controllers/user_controller');

module.exports = (app) => {

    app.route('/api/users')
        .get(authMiddleware, user.index);

    app.route('/api/users/:id')
        .get(authMiddleware, user.findUsers);

    app.route('/api/sendmail')
        .get(user.sendMail)
};