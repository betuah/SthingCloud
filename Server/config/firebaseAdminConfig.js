
const firebaseAdmin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://sthing-cloud.firebaseio.com"
})

module.exports = firebaseAdmin
