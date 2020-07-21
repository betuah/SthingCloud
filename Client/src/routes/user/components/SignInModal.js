import React, { Fragment } from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import MaterialIcon from 'components/MaterialIcon'
import { TextField, Button } from '@material-ui/core'
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons'

import './style.scss'
import 'styles/loaders/loaders.scss'

const Loading = () => {
    return(
        <div className="ball-pulse">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

const SignInModal = (props) => {

    return (
        <Fragment>
            <div className="text-center text-body-reverse custom-modal-header">
                <div className="custom-modal-bg-header bg-gray"></div>
                <div className="custom-modal-bg-header" style={{opacity: 0.6, backgroundImage: 'url(assets/flat-images/iot_01.png)'}}></div>
                <div className="custom-modal-title">
                    <h3>User Confirmation</h3>
                </div>
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 pt-3 text-center">
                        <p>Please Sign In again for confirmation</p>
                    </div>
                    <div className="col-10 divider divider-dotted"></div>
                    <Button 
                        onClick={props.signInWithGoogle} 
                        disabled={props.googleLoading ? true : false} 
                        className="col-md-10 mb-2 text-white" 
                        variant="contained" 
                        startIcon={props.googleLoading ? false : <GoogleOutlined />} 
                        style={props.googleLoading ? {backgroundColor: '#EF9A9A'} : {backgroundColor: '#DD2C00'}}
                    >
                        {props.googleLoading ? <Loading /> : 'SignIn With Google'}
                    </Button>
                    <Button 
                        onClick={props.signInWithGithub}
                        disabled={props.githubLoading ? true : false} 
                        className="col-md-10 text-white" 
                        variant="contained" startIcon={props.githubLoading ? false : <GithubOutlined />} 
                        style={props.githubLoading ? {backgroundColor: '#404040'} : {backgroundColor: '#212121'}}
                    >
                        {props.githubLoading ? <Loading /> : 'SignIn With GitHub'}
                    </Button>

                    <div className="col-10 divider divider-with-content text-primary"><span className="divider-inner-content">OR</span></div>

                    <form onSubmit={props.handleOk} name="emailPassword" className="form-v1 mt-3 mb-2 col-md-10">
                        <div className="form-group">
                            <div className="input-group-v1">
                                <div className="input-group-icon">
                                    <MaterialIcon icon="email" style={{color: '#00BCD4'}} />
                                </div>
                                <TextField                                   
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    autoComplete="off"
                                    required
                                    placeholder="Your email address"
                                    value={props.email}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group-v1">
                                <div className="input-group-icon">
                                    <MaterialIcon icon="lock" style={{color: '#00BCD4'}} />
                                </div>
                                <TextField                                   
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    autoComplete="off"
                                    onChange={props.handleChange}
                                    required
                                    placeholder="type your password again"
                                    value={props.password}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-group d-flex justify-content-center">
                            <Button 
                                className="mb-2 col-md-9" 
                                variant="contained" color="primary" 
                                type="submit"
                                disabled={props.signinLoading ? true : false}
                            >
                                {props.signinLoading ? <Loading /> : 'SignIn'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default withAuth(SignInModal)