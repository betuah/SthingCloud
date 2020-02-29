const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const deviceSchema = new Schema({
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
    lastConn    : { 
        type: Date, 
        trim: true,
        required: false 
    }, 
    state       : { 
        type: Number, 
        trim: true,
        required: false 
    }, 
    _createdAt   : {
        type: Date,
        default: Date.now
    },
    _updatedAt   : {
        type: Date,
        default: Date.now
    }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;