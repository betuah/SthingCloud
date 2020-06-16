const authMiddleware = require('../middlewares/auth_middleware')
const control = require('../controllers/control_controller')

module.exports = (app) => {   

    app.route('/api/controller')
        .get(authMiddleware, control.index)

    app.route('/api/controller/:id')
        .get(authMiddleware, control.findOne)

    app.route('/api/controller')
        .post(authMiddleware, control.create)
    
    app.route('/api/controller/:id')
        .put(authMiddleware, control.edit)

    app.route('/api/controller/widget_layouts/:id')
        .put(authMiddleware, control.widget_layouts)
    
    app.route('/api/controller/default/:id')
        .put(authMiddleware, control.defaultControl)

    app.route('/api/controller') 
        .delete(authMiddleware, control.delete)
        
    app.route('/api/controller/widget/:controllerId')
        .post(authMiddleware, control.widget_create)
    
    app.route('/api/controller/widget/:controllerId/:widgetId')
        .put(authMiddleware, control.widget_update)
    
    app.route('/api/controller/widget/:controllerId/:widgetId')
        .delete(authMiddleware, control.widget_delete)

    app.route('/api/controller/widgetData/:controllerId/:widgetId')
        .put(authMiddleware, control.widgetData_update)
        
};