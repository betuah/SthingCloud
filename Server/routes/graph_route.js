const authMiddleware = require('../middlewares/auth_middleware')
const graph = require('../controllers/graph_controller')

module.exports = (app) => {   

    app.route('/api/sharegraph/:userId/:id')
        .get(graph.findShareGraph)

    app.route('/api/graph')
        .get(authMiddleware, graph.index)

    app.route('/api/graph/:id')
        .get(authMiddleware, graph.findOne)

    app.route('/api/graph')
        .post(authMiddleware, graph.create)
    
    app.route('/api/graph/:id')
        .put(authMiddleware, graph.edit)

    app.route('/api/graph_layouts/:id')
        .put(authMiddleware, graph.graph_layouts)
    
    app.route('/api/graph/default/:id')
        .put(authMiddleware, graph.defaultGraph)

    app.route('/api/graph')
        .delete(authMiddleware, graph.delete)
        
    app.route('/api/graph/widget/:graphId')
        .post(authMiddleware, graph.widget_create)
    
    app.route('/api/graph/widget/:graphId/:widgetId')
        .put(authMiddleware, graph.widget_update)
    
    app.route('/api/graph/widget/:graphId/:widgetId')
        .delete(authMiddleware, graph.widget_delete)

    app.route('/api/graph/widgetData/:graphId/:widgetId')
        .put(authMiddleware, graph.widgetData_update)
        
};