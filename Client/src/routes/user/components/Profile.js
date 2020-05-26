import React, { Component, Fragment } from 'react'
import Button from '@material-ui/core/Button'
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
                <section className="text-center text-body-reverse" style={{position: 'relative', paddingTop: '50px', paddingBottom: '50px'}}>
                    <div className="hero-bg-img" style={{backgroundColor: '#424242'}}></div>
                    <div className="hero-bg-img" style={{opacity: 0.6, backgroundImage: 'url(assets/flat-images/nature_flat_03.jpg)'}}></div>
                    <div style={{position: 'relative'}}>
                        <h3>User Profile</h3>
                    </div>
                </section>
                <div className="container-fluid mt-4">    
                    <div className="row">
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