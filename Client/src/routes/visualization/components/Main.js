import React, { Component } from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import loadable from 'react-loadable';
import LoadingComponent from 'components/Loading';
import { withAuth } from 'components/Auth/context/AuthContext';
import Breadcrumb from 'components/Layout/Breadcrumb';
import MaterialIcon from 'components/MaterialIcon';
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
                <div className="container-fluid container-mw-xxl no-breadcrumb">    
                    <div className="row">
                        <div className="col-md-6 text-left" style={{color: '#2196F3' }}>                            
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#FF9800'}}><MaterialIcon icon="bar_chart" style={{color: '#FFFFFF'}} />  Visualization   </span></b></h5>
                        </div>
                        <div className="col-md-6 text-right" >
                            <Breadcrumb />
                        </div>
                        <Switch>
                            <Route exact path={`${match.url}/graph`}>
                                <div className="col-md-12 p-lg-3 p-3">
                                    <Graph {...this.props} />
                                </div>
                            </Route>
                            <Route exact path={`${match.url}`}>
                                <div className="col-md-12">
                                    <GraphList {...this.props} />
                                </div>
                            </Route>
                        </Switch>
                    </div>                                       
                </div>
            </div>
        )
    }
}

export default withAuth(Main);