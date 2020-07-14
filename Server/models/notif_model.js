const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const logSchema = new Schema({
    status: {
        type: Number,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    _dataCreatedAt : {
        type: Date,
        default: Date.now
    }
})

const notifDataSchema = new Schema({ 
    userId      : { 
        type: String, 
        trim: true,
        required: true
    },
    notif: {
        status: {
            type: Number,
            trim: true
        },
        title: {
            type: String,
            trim: true
        },
        message : {
            type: String,
            trim: true
        },
        read: {
            type: Number,
            trim: true
        },
        _dataCreatedAt : {
            type: Date,
            default: Date.now
        }
    },
    log: {logSchema}
}, { timestamps: true });

const notifData = mongoose.model('notifLog_data', notifDataSchema);

module.exports = notifData