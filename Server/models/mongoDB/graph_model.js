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
    type_widget: {
        type: String,
        trim: true,
    },
    deviceId: {
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
    _idUsers    : { 
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
    graph_widget    : WidgetSchema],
    action          : [ActionSchema]
}, { timestamps: true });

const GraphData = mongoose.model('graph_data', graphDataSchema);

module.exports = GraphData;