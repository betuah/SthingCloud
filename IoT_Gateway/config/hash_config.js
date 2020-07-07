// Nodejs encryption with CTR
const crypto = require('crypto')
const env = require('../env')

const algorithm = 'aes-256-cbc'
const key = env.encryption_key

exports.decrypt = data => {
    let iv = Buffer.from(data.split('.')[0], 'hex')
    let encryptedData = Buffer.from(data.split('.')[1], 'hex')
    let decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encryptedData)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}