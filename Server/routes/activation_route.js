const user = require('../controllers/user_controller');

module.exports = (app) => {

    app.route('/activated/:token')
        .get(user.activation)
};