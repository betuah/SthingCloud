import React, { Component } from 'react'
import axios from "axios"
import socketOpen from 'socket.io-client'
import { FireAuth, FireDatabase } from 'config/Firebase'

const server_url    = `${process.env.REACT_APP_SERVER_DOMAIN}`
const socket_url    = `${process.env.REACT_APP_SOCKET_DOMAIN}` 
const client_url    = `${process.env.REACT_APP_CLIENT_DOMAIN}`
const api_url       = `${process.env.REACT_APP_API_DOMAIN}` 
const axiosReq      = axios.create()
const AuthContext   = React.createContext()

//konfigurasi untuk axios 
axiosReq.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
})

let socket = socketOpen(`${socket_url}`)

export class AuthContextProvider extends Component {

    constructor() {
        super()
            this.state = {
                profileData: JSON.parse(localStorage.getItem('profileData')) || false,
                token: localStorage.getItem('token') || false,
                isLoggedIn: (localStorage.getItem('token') === null) ? false : true,
                server_url: server_url,
                socket_url: socket_url,
                client_url: client_url,
                api_url: api_url
            }

            this.checkToken             = this.checkToken.bind(this)
            this.initSocket             = this.initSocket.bind(this)
            this.signIn                 = this.signIn.bind(this)
            this.signOut                = this.signOut.bind(this)
            this.setIsLoggin            = this.setIsLoggin.bind(this)
            this.userUpdateProfile      = this.userUpdateProfile.bind(this)
            this.sendEmailVerification  = this.sendEmailVerification.bind(this)
            this.initUser               = this.initUser.bind(this)
            this.initTimeZoneList       = this.initTimeZoneList.bind(this)
    }

    checkToken () {
        return axiosReq.get(`${server_url}/api/tokenverify`)
            .catch(err => {
                this.setState({ isLoggedIn: false });
                localStorage.clear()
            })
    }

    initUser = () => {
        const { uid } = JSON.parse(localStorage.getItem('profileData'))
        const user = FireDatabase.ref(`users/${uid}/personalData`)

        user.on('value', res => {
            const snap = res.val()

            const userData = {
                uid: uid,
                fullName: snap.fullName,
                email: snap.email,
                gender: snap.gender,
                address: snap.address,
                organization: snap.organization,
                profession: snap.profession,
                photoUrl: snap.photoUrl
            }
            
            this.setState({
                profileData: {
                    ...userData
                }
            })

            localStorage.setItem("profileData", JSON.stringify(userData))
        })
    }

    initSocket = () => {
        const profileData = JSON.parse(localStorage.getItem('profileData'))
        return socket.emit('join_room', profileData.uid )
    }

    initTimeZoneList = async () => {
        await axios.get(`http://worldtimeapi.org/api/timezone`).then(res => {
            localStorage.setItem('timeZoneList', JSON.stringify(res.data))
        })

        return await axiosReq.get(`${server_url}/api/user/settings`).then(res => {
            localStorage.setItem('timeZone', res.data !== null ? res.data.timeZone : 'Asia/Jakarta')
        })
    }

    setIsLoggin (stats) {
        this.setState({
            isLoggedIn: stats,
        })
    }

    //login
    signIn (credentials) {
        return new Promise((resolve, reject) => axios.post(`${server_url}/api/signin`, credentials)
            .then(response => {
                const { token, dataProfile } =  response.data
                const profileData = JSON.stringify(dataProfile);

                FireAuth.onAuthStateChanged(async user => {
                    if (user) {
                        localStorage.setItem("token", token)
                        localStorage.setItem("profileData", profileData)
        
                        const res = { status: 'Success', code: 200, msg: 'Success SignIn' }
        
                        return resolve(res)
                    } else {
                    const err = { status: 'Error', code: 404, msg: 'User not SignIn' }
                      return reject(err)
                    }
                })
            })
            .catch(error => {
                if(error.response) {
                    const res = error.response.data;
                    const resMsg = { status: 'Error', code: res.code === '406' ? res.code : 400, msg: res.msg }  
                    return reject(resMsg)
                } else {
                    const resMsg = { status: 'Error', code: 500, msg: error}         
                    return reject(resMsg)
                }
            })
        ) 
    }

    sendEmailVerification = email => {
        const actionCodeSettings = {
            url: `${client_url}`,
            handleCodeInApp: true,
        }

        return FireAuth.currentUser.sendEmailVerification(actionCodeSettings)
    }

    userUpdateProfile = (data) => {
        const firebaseUser = FireAuth.currentUser
        
        return new Promise ((resolver, reject) => {
            firebaseUser.updateProfile({
                displayName: `${data.fullName}`,
                photoUrl: data.photoUrl
            }).then(() => {
                this.sendEmailVerification(data.email)
                axios.post(`${server_url}/api/signup`, { 
                    uid: data.uid,
                    fullName: data.fullName,
                    email: data.email,
                    photoUrl: data.photoUrl
                }).then(() => {
                    resolver('Success!', null)
                }).catch(err => {
                    reject(null, err)
                })
            }).catch(err => {
                reject(null, err)
            })
        })
    }

    //logout
    signOut() {
        FireAuth.signOut().then(() => {
            axiosReq.post(`${server_url}/api/signout`)
            .then(res => {
                this.setState({
                    isLoggedIn: false,
                    profileData: false
                })
        
                // localStorage.removeItem('token')
                // localStorage.removeItem('profileData')
                localStorage.clear();

                return true
            }).catch(err => {
                return false
            })
        }).catch(err => {
            return false
        })
    }

    render() {
        return (
                <AuthContext.Provider 
                    value={{
                        signIn: this.signIn,
                        setIsLoggin: this.setIsLoggin,
                        userUpdateProfile: this.userUpdateProfile,
                        signOut: this.signOut,
                        initSocket: this.initSocket,
                        initUser: this.initUser,
                        checkToken: this.checkToken,
                        initTimeZoneList: this.initTimeZoneList,
                        socket: socket,
                        axios: axiosReq,
                        ...this.state
                    }}>
                    {this.props.children}
                </AuthContext.Provider>
        )
    }
}

//Higher Order Component
export const withAuth = (WrappedComponent) => {
    return class extends Component {
        render() {
            return (
                <AuthContext.Consumer>
                    {(context) => (
                        <WrappedComponent {...this.props} {...context} />
                    )}
                </AuthContext.Consumer>
            )
        }
    }
}