import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { withAuth } from '../Auth/context/AuthContext'

import LoginForm from './LoginForm';
import SignUp from './RegisterForm';
import ResetForm from './ResetForm';

import './styles.scss';

class Auth extends Component {
    render() {
        return( 
            <Layout className="app-layout" style={{height: '100%'}}>                                
                    <section className="h-100 w-100" style={{'backgroundColor': '#f5f5f5', position: 'absolute'}}> 
                        <div className="cover-bg-img"></div>
                        <div className="container">
                            <div className="row">
                                <div className="d-flex justify-content-center h-100 w-100">
                                    <div className="col-md-6 col-lg-6 pt-6">
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
