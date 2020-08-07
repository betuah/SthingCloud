const userSettingModel      = require('../models/usersData_model')
const jwt                   = require('jsonwebtoken')
const env                   = require('../env')
const bcrypt                = require('bcryptjs')
const hash                  = require('../config/hash_config')
const firebaseAdmin         = require('../config/firebaseAdminConfig')
const firebaseAuth          = firebaseAdmin.auth()
const firebaseDatabaseAdmin = firebaseAdmin.database()

const secret                = env.token_secret

exports.tokenVerify = (req, res) => {
    res.status(202).json({'status': 'Token Verified', code: 202, test: req.cookie})
}

exports.getCsrf = (req, res) => {
    const csrf = req.csrfToken()

    res.cookie('xsrfToken', csrf)
    res.send('OK')
}

exports.signIn = async (req, res) => {
    try {
        firebaseAuth.verifyIdToken(req.body.token, true)
        .then(decodedToken => {
            const databaseRef   = firebaseDatabaseAdmin.ref('users/' + decodedToken.uid)

            databaseRef.once('value').then(snapshot => {
                const getPerson = snapshot.val().personalData
                const getRoles  = snapshot.val().roles

                const saltRounds    = 10
                const salt          = bcrypt.genSaltSync(saltRounds)
                const rolesHash     = bcrypt.hashSync(`${getRoles.id}`, salt)

                const token     = jwt.sign({ uid: decodedToken.uid, roles: `${rolesHash}`, refresh_token: req.body.token}, secret, { expiresIn: '2h' });
                const userData  = {
                    signin: 1,
                    dataProfile: {
                        uid: decodedToken.uid,
                        fullName: getPerson.fullName,
                        email: getPerson.email,
                        photoUrl: getPerson.photoUrl,
                        gender: getPerson.gender,
                        profession: getPerson.profession,
                        organization: getPerson.organization,
                        address: getPerson.address
                    }
                }

                const encryptedToken = hash.encrypt(token)

                res.cookie('sthingToken', encryptedToken, { httpOnly: true, secure: env.node_env === 'production' ? true : false })
                res.status(200).json(userData)
            }).catch(err => {
                console.log(new Error(err))
                res.status(404).json({ code: 404, msg: 'DATA NOT FOUND!' })
            })
        }).catch(err => {
            res.status(401).json({status: 'UNAUTHORIZED', code: 401, msg: 'You are not authenticated!'})
            console.log(new Error(err))
        })
    } catch (error) {
        console.log(new Error(error))
        res.status(500).send({status: 'INTERNAL_SERVER_ERROR', code: 500, msg: 'Something wrong in the server!'})
    }
}

exports.signUp = async (req, res) => {
    try {
        const fireDatabase = firebaseDatabaseAdmin.ref(`users/${req.body.uid}`)
        const userDataBody = {
            personalData : {
                fullName: req.body.fullName,
                email: req.body.email,
                photoUrl: req.body.photoUrl,
                gender: '',
                profession: '',
                organization: '',
                address: ''
            },
            roles : {
                id: 1,
                title: "user"
            }
        }

        fireDatabase.set({
            ...userDataBody
        }).then(() => {
            const userSetData = {
                userId   : req.body.uid,
                ...userDataBody,
                timeZone : 'Asia/Jakarta',
                smtp     : {
                    host: '',
                    port: '',
                    secure: 1,
                    tls: 1,
                    username: '',
                    password: ''
                }
            }

            userSettingModel.create(userSetData)
            .then(result => {
                const msg = {
                    status: "Success",
                    code: "200",
                    msg: "Success Saving Data!"
                }
                res.status(200).json(msg)
            })
            .catch(err => {
                console.log(new Error(err))
                const msg = {
                    status: "INTERNAL_SERVER_ERROR",
                    code: 500,
                    msg: "Internal Server Error! Something wrong in firebase backend!"
                }
                res.status(500).json(msg)
            })
        }).catch(err => {
            console.log(new Error(err))
            const msg = {
                status: "INTERNAL_SERVER_ERROR",
                code: 500,
                msg: "Internal Server Error! Something wrong in firebase backend!"
            }
            res.status(500).json(msg)
        })
    } catch (error) {
        console.log(new Error(error));
        const data = {
            status: 'ERROR',
            code: 400,
            msg: 'Data Required!',
            POST_DATA_REQUIREMENT: {
                username: {
                    type: 'text',
                    required: 'true',
                    unique: 'true',
                    data_type: 'varchar(50)'
                },
                fullName: {
                    type: 'text',
                    required: 'true',
                    unique: 'true',
                    data_type: 'varchar(50)'
                },
                email: {
                    type: 'email',
                    required: 'true',
                    unique: 'true',
                    data_type: 'varchar(50)'
                }
            }
        }
        res.status(400).json(data);
    }    
}

exports.signOut = async (req, res) => {
    const token          = req.token
    const decryptedToken = hash.decrypt(token)
    const decoded        = jwt.verify(decryptedToken, secret)

    res.clearCookie('sthingToken')
    res.clearCookie('_sthing')

    firebaseAuth.revokeRefreshTokens(decoded.uid).then(Response => {
        res.status(200).json({msg: 'Success Revoke Refresh Token!', res: Response})
    }).catch(err => {
        console.log(new Error(err))
        res.status(500).json({msg: 'Cannot revoke token! '+err})
    })
}

exports.profile = async (req, res) => {
    const databaseRef   = firebaseDatabaseAdmin.ref('users/' + req.uid)

    databaseRef.once('value').then(snapshot => {
        const getPerson = snapshot.val().personalData
        res.status(200).json(getPerson);
    }).catch(err => {
        console.log(new Error(err))
        res.status(500).send({status: 'INTERNAL_SERVER_ERROR', code: 500, msg: 'Something wrong in the server!'})
    })
}
