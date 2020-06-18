import React, { Component, Fragment } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'

let SettingsForm = loadable({
    loader: () => import('./settings_components/SettingsForm'),
    loading: LoadingComponent
})

class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tabIndexValues: 0,
        }
    }

    componentDidMount() {
        this.props.checkToken()
    }

    render() {

        return (
            <Fragment>
                <div className="container-fluid mt-5 mb-5">
                    <SettingsForm />
                </div>
            </Fragment>
        )
    }
}

export default withAuth(Settings)