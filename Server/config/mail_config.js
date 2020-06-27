const nodemailer = require('nodemailer')

const transporter = (data) => nodemailer.createTransport({
    host: `${data.host}`,
    port: data.port,
    secure: data.secure,
    auth: {
        // ganti dengan akun email mu
        user: data.user,
        pass: data.password
    },
    tls: {
        rejectUnauthorized: data.tls
    }
});

module.exports = transporter