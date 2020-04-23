const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const WidgetSchema = new Schema({
    widgetTitle: {
        type: String,
        trim: true,
    },    
    resourceType: {
        type: String,
        trim: true,
    },
    resourceId: {
        type: String,
        trim: true,
    },
    widgetChart: {
        type: String,
        trim: true,
    },
    data: {}
})

const controllerDataSchema = new Schema({
    _id         : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    userId      : { 
        type: String, 
        trim: true,
        required: true 
    },
    controller  : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    desc        : { 
        type: String, 
        trim: true,
        required: true 
    },
    controller_default : {
        type: Number, 
        trim: true
    },
    layouts : {},
    controller_widget    : [WidgetSchema],
}, { timestamps: true });

const ControllerData = mongoose.model('control_data', controllerDataSchema);

module.exports = ControllerData;