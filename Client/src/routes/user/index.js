import React, { Component, Fragment } from 'react'
import { Redirect, Route, Switch } from "react-router-dom"
import { withAuth } from 'components/Auth/context/AuthContext'
import Profile from './components/Profile.js'
import Settings from './components/Settings.js'

class User extends Component {
    componentDidMount() {
        this.props.checkToken();
    }
    
    render() {
        const { match, location } = this.props
        
        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />

        return (
            <Fragment>
                <div className="text-center text-body-reverse" style={{position: 'relative', paddingTop: '20px', paddingBottom: '20px'}}>
                    <div className="hero-bg-img" style={{backgroundColor: '#424242'}}></div>
                    <div className="hero-bg-img" style={{opacity: 0.6, backgroundImage: 'url(assets/flat-images/nature_flat_03.jpg)'}}></div>
                    <div className="custom-modal-title" style={{position: 'relative'}}>
                        <h3>{location.pathname === `${match.url}/profile` ? 'User Profile' : 'Settings'}</h3>
                    </div>
                </div>
                <Switch>
                    <Route exact path={`${match.url}/profile`} component={Profile} />
                    <Route exact path={`${match.url}/settings`} component={Settings} />
                </Switch>
            </Fragment>
        )
    }
}

export default withAuth(User);