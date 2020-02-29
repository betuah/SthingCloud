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
            <Layout className="app-layout">                                
                    <section className="cover cover-color-reverse py-8" style={{'backgroundColor': '#F5F5F5'}}>
                        
                        <div className="cover-bg-img"></div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-7 col-lg-6 mx-auto">
                                    <Switch>
                                        <Route path={`/user/signin`} component={LoginForm} />
                                        <Route path={`/user/signup`} component={SignUp} />
                                        <Route path={`/user/reset`} component={ResetForm} />
                                        <Route path='*'><Redirect to={"/"} /></Route>
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </section>                
            </Layout> 
        )
    }
}

export default withAuth(Auth);
