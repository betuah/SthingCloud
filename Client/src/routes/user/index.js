import React, { Component } from 'react'
import { Redirect, Route, Switch } from "react-router-dom"
import { withAuth } from 'components/Auth/context/AuthContext'
import Profile from './components/Profile.js'
import Settings from './components/Settings.js'

class User extends Component {
    componentDidMount() {
        this.props.checkToken();
    }
    
    render() {
        const { match } = this.props

        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />

        return (
            <div>
                <Switch>
                    <Route exact path={`${match.url}/profile`} component={Profile} />
                    <Route exact path={`${match.url}/settings`} component={Settings} />
                </Switch>
            </div>
        )
    }
}

export default withAuth(User);