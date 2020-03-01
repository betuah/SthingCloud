import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { withAuth } from 'components/Auth/context/AuthContext';
import Breadcrumb from 'components/Layout/Breadcrumb';
import MaterialIcon from 'components/MaterialIcon';

class Visualization extends Component {
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
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#FF9800'}}><MaterialIcon icon="bar_chart" style={{color: '#FFFFFF'}} />  Visualization   </span></b></h5>
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

export default withAuth(Visualization);