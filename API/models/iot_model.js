const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const iotDataSchema = new Schema({
    _id         : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    _idDevice    : { 
        type: String, 
        trim: true,
        required: true 
    },
    data      : { 
        type: String, 
        trim: true,
        required: true 
    },
    _createdAt   : {
        type: Date,
        default: Date.now
    },
    _updatedAt   : {
        type: Date
    }
});

const IotData = mongoose.model('Device', iotDataSchema);

module.exports = IotData;