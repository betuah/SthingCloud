import React, { Component } from 'react';
import axios from "axios"

const axiosReq = axios.create()
const AuthContext = React.createContext()

//konfigurasi untuk axios
axiosReq.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
})


export class AuthContextProvider extends Component {

    constructor() {
        super()
            this.state = {
                person: JSON.parse(localStorage.getItem('person')) || "",
                token: localStorage.getItem('token') || "",
                isLoggedIn: (localStorage.getItem('token') === null) ? false : true
            }
    }

    checkToken = () => {
        return axiosReq.get("http://localhost:8000/api/tokenverify")
            .catch(err => {
                this.setState({ isLoggedIn: false });
                localStorage.clear()
                console.log(err)
            })
    }

    initUser = () => {
        return axiosReq.get("http://localhost:8000/api/profile")
            .then(response => {
                this.setState({ person: response.data });
            }).catch(err => {
                this.setState({ isLoggedIn: false });
                localStorage.clear()
            })
    }

    //login
    login = (credentials) => {
        return axios.post("http://localhost:8000/api/signin", credentials)
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
                    const resMsg = { status: 'Error', code: 400, msg: res.msg }             
                    return resMsg
                } else {               
                    const resMsg = { status: 'Error', code: 500, msg: 'Internal Server Error'}         
                    return resMsg
                }
            });   
    }

    //logout
    logout = () => {
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