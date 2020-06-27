import React, { Component, Fragment } from 'react'
import { Redirect } from "react-router-dom"
import { withAuth } from 'components/Auth/context/AuthContext'
import DeviceList from './DeviceList'
import Breadcrumb from 'components/Layout/Breadcrumb'
import MaterialIcon from 'components/MaterialIcon'
import Typography from '@material-ui/core/Typography'

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
            <Fragment>
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center justify-content-md-between">
                            <div className="align-self-center">
                                <Typography variant="h5">
                                    <span className="ui-highlight font-weight-bold" style={{backgroundColor: '#2196F3'}}><MaterialIcon icon="developer_board" style={{color: '#FFFFFF'}} /> Devices</span>
                                </Typography>
                            </div>
                            <div className="d-none d-sm-block align-self-center">
                                <Breadcrumb />
                            </div>     
                        </div>
                        <div className="col-12 divider divider-dotted"></div>
                        <div className="col-xs-12 col-md-12">
                            <DeviceList {...this.props} />
                        </div>
                    </div>                                       
                </div>
            </Fragment>
        )
    }
}

export default withAuth(Device);