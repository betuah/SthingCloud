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
                    <section className="h-100 w-100" style={{'backgroundColor': '#000', position: 'absolute'}}> 
                        <div className="cover-bg-img" style={{backgroundImage: 'url(assets/flat-images/nature_flat_03.jpg)', opacity: '0.5'}}></div>
                        <div className="container">
                            <div className="row">
                                <div className="d-flex justify-content-center w-100">
                                    <div className="d-flex align-items-center h-100" style={{position: 'absolute'}}>
                                        <Switch>
                                            <Route path={`/user/signin`} component={LoginForm} />
                                            <Route path={`/user/signup`} component={SignUp} />
                                            <Route path={`/user/reset`} component={ResetForm} />
                                            <Route path='*'><Redirect to={"/"} /></Route>
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>                
            </Layout> 
        )
    }
}

export default withAuth(Auth);
