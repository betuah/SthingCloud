const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const WidgetSchema = new Schema({
    _id         : { 
        type: String, 
        trim: true,
        unique: true,
        required: true
    },
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
        index: true,
        trim: true,
    },
    widgetChart: {
        type: String,
        trim: true,
    },
    dataId: {
        type: String,
        index: true,
        trim: true,
    },
    dataValue: {
        type: Number,
        trim: true,
    },
    settings: {
        triggerMax: {
            value: {
                type: String,
                trim: true,
            },
            notif: {
                type: String,
                trim: true,
            },
            mail: {
                type: String,
                trim: true,
            },
            mailList: {
                type: String,
                trim: true,
            },
            actionOn: [],
            actionOff: [],
        },
        triggerMin: {
            value: {
                type: String,
                trim: true,
            },
            notif: {
                type: String,
                trim: true,
            },
            mail: {
                type: String,
                trim: true,
            },
            mailList: {
                type: String,
                trim: true,
            },
            actionOn: [],
            actionOff: [],
        }
    }
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
        index: true,
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
    graph_widget    : [WidgetSchema]
}, { timestamps: true });

const GraphData = mongoose.model('graph_data', graphDataSchema);

module.exports = GraphData;