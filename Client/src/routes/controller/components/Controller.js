import React, { Component, Fragment } from 'react'
import { Redirect, Route, Switch } from "react-router-dom"
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
import Breadcrumb from 'components/Layout/Breadcrumb'
import MaterialIcon from 'components/MaterialIcon'
import ControllerList from './ControllerList'
import Typography from '@material-ui/core/Typography'
import QueueAnim from 'rc-queue-anim'

let ControllerWidget = loadable({
    loader: () => import('./ControllerWidget'),
    loading: LoadingComponent
})

class Controller extends Component {
    componentDidMount() {
        this.props.checkToken();
    }

    render() {
        const { match } = this.props

        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />

        return (
            <Fragment>
                <Switch>
                    <Route exact path={`${match.url}/:controllerId`} component={ControllerWidget} />
                    <Route exact path={`${match.url}`}>
                        <div className="container-fluid pt-4">
                            <QueueAnim className="row">
                                <div key='1' className="col-12 d-flex justify-content-center justify-content-md-between">
                                    <div key='2' className="align-self-center">
                                        <Typography variant="h5">
                                            <span className="ui-highlight font-weight-bold" style={{backgroundColor: '#FF5722'}}><MaterialIcon icon="bar_chart" style={{color: '#FFFFFF'}} /> Controller</span>
                                        </Typography>
                                    </div>
                                    <div key='3' className="d-none d-sm-block align-self-center">
                                        <Breadcrumb />
                                    </div>     
                                </div>
                                <div key='4' className="col-12 divider divider-dotted"></div>
                                <div key='5' className="col-xs-12 col-md-12">
                                    <ControllerList {...this.props} />
                                </div>
                            </QueueAnim>
                        </div>
                    </Route>
                </Switch>
            </Fragment>
        )
    }
}

export default withAuth(Controller);