const multer                = require('multer')
const env                   = require('../env')
const bcrypt                = require('bcrypt')
const transporter           = require('../config/mail_config')
const firebaseAdmin         = require('../config/firebaseAdminConfig')
const firebaseDatabaseAdmin = firebaseAdmin.database()
const fs                    = require('fs')
const userSettingModel      = require('../models/userSetting_model')

exports.index = (req, res) => {
    try {
        userSettingModel.findOne({ userId: req.id_user }).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ status: "Error", code: "401", msg: "UNAUTHORIZED!"})
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.update = async (req, res) => {
    try {
        const password      = req.body.password === "" || req.body.password === null ? false : req.body.password
        const oldPassword   = req.body.oldPassword === "" || req.body.password === null ? false : req.body.oldPassword
        const saltRounds    = 10
        const salt          = bcrypt.genSaltSync(saltRounds)
        const passwordHash  = bcrypt.hashSync(password ? password : '', salt)

        const dataBody  = { 
            userId   : req.id_user,
            timeZone : req.body.timeZone,
            smtp     : {
                host: req.body.host,
                port: req.body.port,
                secure: req.body.secure,
                tls: req.body.tls,
                username: req.body.username,
                password: !password && !oldPassword ? "" : (!password && oldPassword  ? oldPassword : passwordHash)
            }
        }

        userSettingModel.findOneAndUpdate({ userId: req.id_user },
        { 
            $set: { 
                ...dataBody
            }
        }, { upsert: true })
        .then(data => {
            res.status(201).json({ status: 'Success', code: 200, 'msg': 'Data is updated!', data: data})
        })
        .catch(err => {
            res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed update data!' + err})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Errorss'})
    }
}

exports.avatarUpload = (req, res) => {
    const path = 'public/avatars'

    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, (path))
        },
        filename: (req, file, callback) => {
            let filetype = file.mimetype === 'image/png' ? 'png' : (file.mimetype === 'image/jpg' ? 'jpg' : (file.mimetype === 'image/jpeg' && 'jpeg'))

            callback(null, `${req.id_user}_${Date.now()}.${filetype}`)
        }
    })

    const upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
            }
        }
    }).any('file')

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({
                code: 500,
                status: 'INTERNAL_SERVER_ERROR',
                message: err
            })
        } else {
            const fileData = req.files[0]

            const databaseRef   = firebaseDatabaseAdmin.ref(`users/${req.id_user}/personalData`)
            const photoUrl      = await databaseRef.once('value').then(snapshot => snapshot.val().photoUrl).catch(err => err)

            if (photoUrl === false || photoUrl.sourceId === 'api') {
                fs.unlink(`public/avatars/${photoUrl.url}`, err => {
                    err && console.log('Catch Error Remove old picture. ', err)
                })
            }

            const sendToFirebase = await databaseRef.update({
                photoUrl: {
                    sourceId: 'api',
                    url: fileData.filename
                }
            }).then(res => {
                const json = {
                    code: 200,
                    status: "SUCCESS",
                    message: "Success Upload Picture!",
                    data: `${env.server_domain}/public/avatars/${fileData.filename}`
                }

                return json
            }).catch(err => {
                fs.unlink(`public/avatars/${fileData.filename}s`, err => {
                    console.log('Catch Error update firebase database. ', err)
                })

                const json = {
                    code: 500,
                    status: "INTERNAL_SERVER_ERROR",
                    message: "Failed saving data to firebase!"
                }

                return json
            })
            
            res.status(sendToFirebase.code).json(sendToFirebase)
        }
    })
    
}

exports.sendMail = (req, res) => {


    res.send('Welcome :)')
}

exports.sendTestMail = (req, res) => {
    if ( !req.body.host.trim() || !req.body.port.trim() || !req.body.username.trim() || !req.body.password.trim() ) {
        res.status(200).json({ status: 'ERROR', code: 400, msg: 'Request data cannot be empty. Please check your data!'})
    } else {

        const data = {
            host: `${req.body.host}`,
            port: req.body.port,
            secure: req.body.secure === '1' ? true : false,
            username: `${req.body.username}`,
            password: `${req.body.password ? req.body.password : ''}`,
            tls: req.body.tls === '1' ? true : false
        }

        var mailOptions = {
            to: `${req.body.sendToMail}`,
            subject: 'SThing - Test Mail',
            html: 'Mantap.. Email udah masuk! <a href="https://teziger.blogspot.com">Aku Sebuah Link</a>'
        }
        
        transporter(data).sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
                res.status(200).json({ status: err.code, code: err.responseCode, msg: err.response})
            } else {
                res.status(200).json({ status: 'SUCCESS', code: 200, data: { emailTo: info.envelope.to, response: info.response}})
            }
        })
    }
}