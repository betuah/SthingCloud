import React, { Component } from 'react'
import { Redirect, Route, Switch } from "react-router-dom"
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
import Breadcrumb from 'components/Layout/Breadcrumb'
import MaterialIcon from 'components/MaterialIcon'
import GraphList from './GraphList'

let Graph = loadable({
    loader: () => import('./Graph'),
    loading: LoadingComponent
})

class Main extends Component {
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
                    <Route exact path={`${match.url}/graph`}>
                        <Graph {...this.props} />
                    </Route> 
                    <Route exact path={`${match.url}`}>
                        <div className="container-fluid mt-4">
                            <div className="row">
                                <div className="col-xs-12 col-md-6 d-flex justify-content-center justify-content-md-start">
                                    <h5><b><span className="ui-highlight" style={{backgroundColor: '#FF9800'}}><MaterialIcon icon="bar_chart" style={{color: '#FFFFFF'}} />  Visualization   </span></b></h5>
                                </div>
                                <div className="col-xs-12 col-md-6 d-flex justify-content-md-end">
                                    <div className="d-none d-sm-block">
                                        <Breadcrumb />
                                    </div>                                    
                                </div>
                                <div className="col-xs-12 col-md-12">
                                    <GraphList {...this.props} />
                                </div>
                            </div>
                        </div>
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default withAuth(Main);