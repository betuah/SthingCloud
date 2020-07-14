const multer                = require('multer')
const mongoose              = require('mongoose');
const env                   = require('../env')
const hash                  = require('../config/hash_config')
const transporter           = require('../config/mail_config')
const firebaseAdmin         = require('../config/firebaseAdminConfig')
const firebaseDatabaseAdmin = firebaseAdmin.database()
const fs                    = require('fs')
const usersData             = require('../models/usersData_model')
const notifModel            = require('../models/notif_model')

exports.index = (req, res) => {
    try {
        usersData.findOne({ userId: req.id_user }).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ status: "Error", code: "401", msg: "UNAUTHORIZED!"})
        })
    } catch (error) {
        console.log(new Error(error))
        res.status(500).send('Internal Server Error')
    }
}

exports.update = async (req, res) => {
    try {
        const password      = req.body.password === '' || req.body.password === null ? false : req.body.password
        const passwordHash  = hash.encrypt(password ? password : '')
        const passwordData  = password ? { password : passwordHash } : false 

        const dataBody  = { 
            userId   : req.id_user,
            timeZone : req.body.timeZone,
            smtp     : {
                host: req.body.host,
                port: req.body.port,
                secure: req.body.secure,
                tls: req.body.tls,
                username: req.body.username,
                ...passwordData
            }
        }

        usersData.findOneAndUpdate({ userId: req.id_user },
        { 
            $set: { 
                ...dataBody
            }
        }, { upsert: true })
        .then(data => {
            res.status(201).json({ status: 'Success', code: 200, 'msg': 'Data is updated!', data: data})
        })
        .catch(err => {
            console.log(new Error(err))
            res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed update data!' + err})
        })
    } catch (error) {
        console.log(new Error(error))
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
                console.log(new Error(err))
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

exports.sendTestMail = (req, res) => {
    if ( !req.body.host.trim() || !req.body.port.trim() || !req.body.username.trim() || !req.body.password.trim() ) {
        res.status(200).json({ status: 'ERROR', code: 400, msg: 'Request data cannot be empty. Please check your data!'})
    } else {

        const data = {
            host: `${req.body.host}`,
            port: req.body.port,
            secure: req.body.secure ? true : false,
            username: `${req.body.username}`,
            password: `${req.body.password ? req.body.password : ''}`,
            tls: req.body.tls ? true : false
        }

        const fromObject = {
            name: 'SThing - IoT Cloud Platform',
            address: `${req.body.username}`
        }

        const mailOptions = {
            from: fromObject,
            to: `${req.body.sendToMail}`,
            subject: 'Test Mail',
            html: 'Test Mail form SThing Cloud (IoT Cloud Platform) sthing.seamolec.org'
        }
        
        transporter(data).sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(new Error(err))
                res.status(200).json({ status: err.code, code: err.responseCode, msg: err.response})
            } else {
                res.status(200).json({ status: 'SUCCESS', code: 200, data: { emailTo: info.envelope.to, response: info.response}})
            }
        })
    }
}

exports.notif = (req, res) => {
    try {
        notifModel.find(
            { 
                "userId": `${req.id_user}`
            }
        ).then(data => {
            res.status(201).json({ status: 'Success', code: 200, 'msg': 'Success get notif data!', data: data})
        })
    } catch (error) {
        res.status(400).json({ status: 'Failed', code: 400, 'msg' : 'Failed get notif data!'})
        console.log(new Error(error))
    }
}

exports.notifReads = (req, res) => {
    try {
        notifModel.updateMany(
            { 
                "_id": req.body.id,
                "userId": `${req.id_user}`
            },
            {
                "$set" : { "notif.read": 1 }
            }
        ).then(data => {
            res.status(201).json({ status: 'Success', code: 200, 'msg': 'notif is read!', data: data})
        })
    } catch (error) {
        res.status(400).json({ status: 'Failed', code: 400, 'msg' : 'Failed update notif read!'})
        console.log(new Error(error))
    }
}

exports.notifUnreads = (req, res) => {
    try {
        notifModel.updateMany(
            { 
                "_id": req.body.id,
                "userId": `${req.id_user}`
            },
            {
                "$set" : { "notif.read": 0 }
            }
        ).then(data => {
            res.status(201).json({ status: 'Success', code: 200, 'msg': 'notif is unread!', data: data})
        })
    } catch (error) {
        res.status(400).json({ status: 'Failed', code: 400, 'msg' : 'Failed update notif unread!'})
        console.log(new Error(error))
    }
}

exports.notifDelete = (req, res) => {
    try {
        notifModel.deleteMany(
            { 
                "_id": req.body.id,
            }
        ).then(data => {
            res.status(201).json({ status: 'Success', code: 200, 'msg': 'Success delete notif!' })
        })
    } catch (error) {
        res.status(400).json({ status: 'Failed', code: 400, 'msg' : 'Failed update notif read!'})
        console.log(new Error(error))
    }
}