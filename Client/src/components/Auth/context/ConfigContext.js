import React, { Component } from 'react';
import axios from "axios"
import socketOpen from 'socket.io-client';

const server_url      = `${process.env.REACT_APP_SERVER_DOMAIN}`
const socket_url      = `${process.env.REACT_APP_SOCKET_DOMAIN}` 
const client_url      = `${process.env.REACT_APP_CLIENT_DOMAIN}`
const iot_gateway_url = `${process.env.REACT_APP_IOT_GATEWAY_DOMAIN}` 
const ConfigContext   = React.createContext()

let socket = socketOpen(`${socket_url}`)

export class ConfigContextProvider extends Component {

    constructor() {
        super()
            this.state = {               
                server_url: server_url,
                socket_url: socket_url,
                client_url: client_url,
                iot_gateway_url: iot_gateway_url
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