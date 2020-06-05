import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
Firebase.initializeApp(firebaseConfig)

const FireDatabase            = Firebase.database()
const FireAuth                = Firebase.auth()
const FireGoogleAuthProvider  = new Firebase.auth.GoogleAuthProvider()
const FireGithubAuthProvider  = new Firebase.auth.GithubAuthProvider()

export { FireDatabase, FireAuth, FireGoogleAuthProvider, FireGithubAuthProvider, Firebase as default }