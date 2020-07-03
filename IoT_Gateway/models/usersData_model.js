const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const notifSchema = new Schema({
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
})

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

const userDataSchema = new Schema({ 
    userId      : { 
        type: String, 
        trim: true,
        index: true,
        required: true,
        unique: true
    },
    timeZone : { 
        type: String, 
        trim: true,
    }, 
    smtp : {
        host: {
            type: String,
            trim: true,
        },
        port: {
            type: String,
            trim: true,
        },
        secure: {
            type: Number,
            trim: true,
        },
        tls: {
            type: Number,
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
    notif: [notifSchema],
    log: [logSchema]
}, { timestamps: true });

const usersData = mongoose.model('users_data', userDataSchema);

module.exports = usersData