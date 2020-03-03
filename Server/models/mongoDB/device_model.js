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

const deviceDataSchema = new Schema({
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
    device      : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    desc        : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    token       : { 
        type: String, 
        trim: true,
        required: true 
    },
    state       : { 
        type: Number, 
        trim: true,
        required: false 
    }, 
    data        : [DataSchema]
}, { timestamps: true });

const DeviceData = mongoose.model('device_data', deviceDataSchema);

module.exports = DeviceData;