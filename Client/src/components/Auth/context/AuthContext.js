import React, { Component } from 'react';
import axios from "axios"
import socketOpen from 'socket.io-client';

const server_url    = `${process.env.REACT_APP_SERVER_DOMAIN ? process.env.REACT_APP_SERVER_DOMAIN :'http://localhost:8000'}` 
const socket_url    = `${process.env.REACT_APP_SOCKET_DOMAIN ? process.env.REACT_APP_SOCKET_DOMAIN :'http://localhost:4001'}` 
const client_url    = `${process.env.REACT_APP_CLIENT_DOMAIN ? process.env.REACT_APP_CLIENT_DOMAIN :'http://localhost:3000'}` 
const axiosReq      = axios.create()
const AuthContext   = React.createContext()

//konfigurasi untuk axios
axiosReq.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
})

let socket = socketOpen(`${`${process.env.REACT_APP_SOCKET_DOMAIN ? process.env.REACT_APP_SOCKET_DOMAIN :'http://localhost:4001'}`}`)

export class AuthContextProvider extends Component {

    constructor() {
        super()
            this.state = {
                person: JSON.parse(localStorage.getItem('person')) || "",
                token: localStorage.getItem('token') || "",
                isLoggedIn: (localStorage.getItem('token') === null) ? false : true,
                server_url: server_url,
                socket_url: socket_url,
                client_url: client_url
            }

            this.checkToken = this.checkToken.bind(this)
            this.initUser = this.initUser.bind(this)
            this.login = this.login.bind(this)
            this.logout = this.logout.bind(this)
    }

    checkToken () {
        return axiosReq.get(`${server_url}/api/tokenverify`)
            .catch(err => {
                this.setState({ isLoggedIn: false });
                localStorage.clear()
                console.log(err)
            })
    }

    initUser () {
        return axiosReq.get(`${server_url}/api/profile`)
            .then(response => {               
                const res = response.data

                socket.emit('join_room', res.data.id_users )  
              
                this.setState({ person: res.data });
            }).catch(err => {
                this.setState({ isLoggedIn: false });
                localStorage.clear()
            })
    }

    //login
    login (credentials) {
        return axios.post(`${server_url}/api/signin`, credentials)
            .then(response => {
                const { token, data } =  response.data
                const person = JSON.stringify(data);

                localStorage.setItem("token", token)
                localStorage.setItem("person", person)

                this.setState({
                    token: token,
                    isLoggedIn: true
                })

                const res = { status: 'Success', code: 200, msg: 'Success SignIn' }

                return res
            })
            .catch(error => {
                if(error.response) {
                    const res = error.response.data;
                    const resMsg = { status: 'Error', code: res.code === '406' ? res.code : 400, msg: res.msg }  
                    // console.log(error)           
                    return resMsg
                } else {              
                    // console.log('error yang 500') 
                    const resMsg = { status: 'Error', code: 500, msg: 'Internal Server Error'}         
                    return resMsg
                }
            });   
    }

    //logout
    logout () {
        localStorage.removeItem('token')
        localStorage.removeItem('person')
    }

    render() {
        return (
                <AuthContext.Provider 
                    value={{
                        login: this.login,
                        logout: this.logout,
                        initUser: this.initUser,
                        checkToken: this.checkToken,
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