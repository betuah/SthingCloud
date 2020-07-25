import React, { Component, Fragment } from 'react';
import QueueAnim from 'rc-queue-anim';
import Breadcrumb from 'components/Layout/Breadcrumb';
import MaterialIcon from 'components/MaterialIcon';
import { Redirect } from "react-router-dom";
import { withAuth } from 'components/Auth/context/AuthContext';
import MainDashboard from './MainDashboard.js'

class Dashboard extends Component {
    componentDidMount() {
        this.props.checkToken();
    }
    
    render() {
        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />

        return (
            <Fragment>
                <div className="container-fluid pt-4">  
                    <QueueAnim className="row">
                        <div key="1" className="col-xs-12 col-md-6 d-flex justify-content-center justify-content-md-start" style={{color: '#2196F3' }}>                            
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#4CAF50'}}><MaterialIcon icon="dashboard" style={{color: '#FFFFFF'}} />  Dashboard   </span></b></h5>
                        </div>
                        <div key="2" className="col-xs-12 col-md-6 d-flex justify-content-md-end" >
                            <div className="d-none d-sm-block">
                                <Breadcrumb />
                            </div>
                        </div>
                        <div key="3" className="col-xs-12 col-md-12 p-lg-3 p-3">
                            <MainDashboard />
                        </div>
                    </QueueAnim>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(Dashboard);