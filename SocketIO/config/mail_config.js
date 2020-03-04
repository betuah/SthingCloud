const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // ganti dengan akun email mu
        user: 'seamoleciot@gmail.com',
        pass: 'admin122'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter