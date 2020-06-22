const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const AlertSchema = new Schema({
    status: {
        type: String, 
        trim: true,
    },
    message: {
        type: String, 
        trim: true,
    },
    read: {
        type: String, 
        trim: true,
    }
})

const graphDataSchema = new Schema({ 
    userId      : { 
        type: String, 
        trim: true,
        index: true,
        required: true,
        unique: true
    },
    timeZone      : { 
        type: String, 
        trim: true,
    }, 
    smtp        : {
        host: {
            type: String,
            trim: true,
        },
        port: {
            type: String,
            trim: true,
        },
        secure: {
            type: String,
            trim: true,
        },
        tls: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        }
    },
    alert       : [AlertSchema],
}, { timestamps: true });

const userSettingData = mongoose.model('userSetting_data', graphDataSchema);

module.exports = userSettingData;