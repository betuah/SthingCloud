const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const DataSchema = new Schema({
    type: {
        type: String,
        trim: true,
    },
    value: {
        type: Number,
        trim: true,
    },
    _dataCreatedAt   : {
        type: Date,
        default: Date.now
    },
})

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
    data: [DataSchema]
})

const graphDataSchema = new Schema({
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
    graph      : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    desc        : { 
        type: String, 
        trim: true,
        required: true 
    },
    share       : {
        type: Number, 
        trim: true,
        required: true 
    },
    graph_default : {
        type: Number, 
        trim: true
    },
    layouts : {},
    graph_widget    : [WidgetSchema],
    action          : [DataSchema]
}, { timestamps: true });

const GraphData = mongoose.model('graph_data', graphDataSchema);

module.exports = GraphData;