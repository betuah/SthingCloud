import React, { Component, Fragment } from 'react'
import Breadcrumb from 'components/Layout/Breadcrumb'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'

class Profile extends Component {
    componentDidMount() {
        this.props.checkToken();
    }

    render() {
        return (
            <Fragment>
                <div className="container-fluid mt-4">    
                    <div className="row">
                        <div className="col-xs-12 col-md-6 d-flex justify-content-center justify-content-md-start" style={{color: '#2196F3' }}>                            
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#4CAF50'}}><MaterialIcon icon="dashboard" style={{color: '#FFFFFF'}} />  Dashboard   </span></b></h5>
                        </div>
                        <div className="col-xs-12 col-md-6 d-flex justify-content-md-end" >
                            <div className="d-none d-sm-block">
                                <Breadcrumb />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-12 p-lg-3 p-3">
                            <div className="box box-default mb-12">
                                <div className="box-header">

                                </div>
                                <hr></hr>
                                <div className="box-body">

                                </div>
                            </div>
                        </div>
                    </div>                                       
                </div>
            </Fragment>
        )
    }
}

export default withAuth(Profile)