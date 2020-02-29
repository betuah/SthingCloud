import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { withAuth } from 'components/Auth/context/AuthContext';
import DeviceList from './DeviceList';
import Breadcrumb from 'components/Layout/Breadcrumb';
import MaterialIcon from 'components/MaterialIcon';

class Device extends Component {
    render() {
        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />
            
        return (
            <div>
                <div className="container-fluid container-mw-xxl no-breadcrumb">    
                    <div className="row">
                        <div className="col-md-6 text-left" style={{color: '#2196F3' }}>                            
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#2196F3'}}><MaterialIcon icon="developer_board" style={{color: '#FFFFFF'}} />  Devices</span></b></h5>
                        </div>
                        <div className="col-md-6 text-right" >
                            <Breadcrumb />
                        </div>
                        <div className="col-md-12">
                            <DeviceList {...this.props} />
                        </div>
                    </div>                                       
                </div>
            </div>
        )
    }
}

export default withAuth(Device);