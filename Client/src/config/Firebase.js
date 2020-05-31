import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAVVnreX-ICD8ltb2zvdLcEkJSvPrpYHBU",
    authDomain: "sthing-iot-cloud-platform.firebaseapp.com",
    databaseURL: "https://sthing-iot-cloud-platform.firebaseio.com",
    projectId: "sthing-iot-cloud-platform",
    storageBucket: "sthing-iot-cloud-platform.appspot.com",
    messagingSenderId: "459584722014",
    appId: "1:459584722014:web:0b5bedb80a198f83d390cf",
    measurementId: "G-1ZCT6BCYX3"
};
// Initialize Firebase
Firebase.initializeApp(firebaseConfig)

const FireDatabase            = Firebase.database()
const FireAuth                = Firebase.auth()
const FireGoogleAuthProvider  = new Firebase.auth.GoogleAuthProvider()
const FireGithubAuthProvider  = new Firebase.auth.GithubAuthProvider()

export { FireDatabase, FireAuth, FireGoogleAuthProvider, FireGithubAuthProvider, Firebase as default }