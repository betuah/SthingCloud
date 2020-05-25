import React, { Component } from 'react';
import axios from "axios"
import socketOpen from 'socket.io-client';

const server_url    = `${process.env.REACT_APP_SERVER_DOMAIN ? process.env.REACT_APP_SERVER_DOMAIN :'http://localhost:8000'}` 
const socket_url    = `${process.env.REACT_APP_SOCKET_DOMAIN ? process.env.REACT_APP_SOCKET_DOMAIN :'http://localhost:4001'}` 
const client_url    = `${process.env.REACT_APP_CLIENT_DOMAIN ? process.env.REACT_APP_CLIENT_DOMAIN :'http://localhost:3000'}`
const api_url       = `${process.env.REACT_APP_API_DOMAIN ? process.env.REACT_APP_API_DOMAIN :'http://localhost:4000'}` 
const ConfigContext = React.createContext()

let socket = socketOpen(`${`${process.env.REACT_APP_SOCKET_DOMAIN ? process.env.REACT_APP_SOCKET_DOMAIN :'http://localhost:4001'}`}`)

export class ConfigContextProvider extends Component {

    constructor() {
        super()
            this.state = {               
                server_url: server_url,
                socket_url: socket_url,
                client_url: client_url,
                api_url: api_url
            }
    }

    render() {
        return (
            <ConfigContext.Provider 
                value={{
                    socket: socket,
                    axios: axios,
                    ...this.state
                }}>
                {this.props.children}
            </ConfigContext.Provider>
        )
    }
}

//Higher Order Component
export const InitConfig = (WrappedComponent) => {
    return class extends Component {
        render() {
            return (
                <ConfigContext.Consumer>
                    {(context) => (
                        <WrappedComponent {...this.props} {...context} />
                    )}
                </ConfigContext.Consumer>
            )
        }
    }
}