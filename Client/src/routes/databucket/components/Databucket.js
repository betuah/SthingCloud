import React, { Component } from 'react';
import Breadcrumb from 'components/Layout/Breadcrumb';
import MaterialIcon from 'components/MaterialIcon';
import { Redirect } from "react-router-dom";
import { withAuth } from 'components/Auth/context/AuthContext';

class Databucket extends Component {
    componentDidMount() {
        this.props.checkToken();
    }
    
    render() {
        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />

        return (
            <div>
                <div className="container-fluid container-mw-xxl no-breadcrumb">    
                    <div className="row">
                        <div className="col-md-6 text-left" style={{color: '#2196F3' }}>                            
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#9C27B0'}}><MaterialIcon icon="storage" style={{color: '#FFFFFF'}} />  Data Bucket   </span></b></h5>
                        </div>
                        <div className="col-md-6 text-right" >
                            <Breadcrumb />
                        </div>
                        <div className="col-md-12">
                            
                        </div>
                    </div>                                       
                </div>
            </div>
        )
    }
}

export default withAuth(Databucket);