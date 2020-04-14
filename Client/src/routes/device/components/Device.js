import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { withAuth } from 'components/Auth/context/AuthContext';
import DeviceList from './DeviceList';
import Breadcrumb from 'components/Layout/Breadcrumb';
import MaterialIcon from 'components/MaterialIcon';

class Device extends Component {
    state = {
        deviceState: {}
    }

    componentDidMount() {        
        this.props.checkToken();        
    }

    render() { 
        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />
            
        return (
            <div>
                <div className="container-fluid mt-4">    
                    <div className="row">
                        <div className="col-xs-12 col-md-6 d-flex justify-content-center justify-content-md-start" style={{color: '#2196F3' }}>                            
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#2196F3'}}><MaterialIcon icon="developer_board" style={{color: '#FFFFFF'}} />  Devices</span></b></h5>
                        </div>
                        <div className="col-xs-12 col-md-6 d-flex justify-content-md-end">
                            <div className="d-none d-sm-block">
                                <Breadcrumb />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-12">
                            <DeviceList {...this.props} />
                        </div>
                    </div>                                       
                </div>
            </div>
        )
    }
}

export default withAuth(Device);