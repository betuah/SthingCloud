
const firebaseAdmin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://sthing-iot-cloud-platform.firebaseio.com"
})

module.exports = firebaseAdmin
