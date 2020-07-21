import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import { withAuth } from '../Auth/context/AuthContext'

import LoginForm from './LoginForm'
import SignUp from './RegisterForm'
import ResetForm from './ResetForm'

import './styles.scss'

class Auth extends Component {
    render() {
        return( 
            <Layout className="app-layout">                                
                    <section className="w-100 h-100" style={{'backgroundColor': '#000', position: 'absolute'}}> 
                        <div className="cover-bg-img" style={{backgroundImage: 'url(assets/flat-images/nature_flat_03.jpg)', opacity: '0.3'}}></div>
                        <div className="container d-flex h-100">
                            <div className="row justify-content-center align-self-center mx-auto">
                                <Switch>
                                    <Route path={`/user/signin`} component={LoginForm} />
                                    <Route path={`/user/signup`} component={SignUp} />
                                    <Route path={`/user/reset`} component={ResetForm} />
                                    <Route path='*'><Redirect to={"/"} /></Route>
                                </Switch>
                            </div>
                        </div>
                    </section>                
            </Layout> 
        )
    }
}

export default withAuth(Auth);
