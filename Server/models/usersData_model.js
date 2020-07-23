const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const userDataSchema = new Schema({ 
    userId      : { 
        type: String, 
        trim: true,
        index: true,
        required: true,
        unique: true
    },
    personalData : {},
    roles: {},
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
    }
}, { timestamps: true });

const usersData = mongoose.model('users_data', userDataSchema);

module.exports = usersData