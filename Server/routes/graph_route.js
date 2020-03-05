const authMiddleware = require('../middlewares/auth_middleware');
const graph = require('../controllers/graph_controller');

module.exports = (app) => {   

    app.route('/api/graph')
        .get(authMiddleware, graph.index);

    app.route('/api/graph')
        .post(authMiddleware, graph.create);
    
    app.route('/api/graph/:id')
        .put(authMiddleware, graph.edit);

    app.route('/api/graph')
        .delete(authMiddleware, graph.delete);
    
    app.route('/api/graph/:id')
        .get(authMiddleware, graph.findOne);
        
    app.route('/api/graph/widget')
        .post(authMiddleware, graph.widget_create);
        
};