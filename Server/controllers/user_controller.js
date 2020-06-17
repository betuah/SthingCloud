const multer                = require('multer')
const env                   = require('../env')
const firebaseAdmin         = require('../config/firebaseAdminConfig')
const firebaseDatabaseAdmin = firebaseAdmin.database()
const fs                    = require('fs')

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
