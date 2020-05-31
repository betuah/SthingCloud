import React from 'react'
import { Link } from 'react-router-dom'
import { withAuth } from '../Auth/context/AuthContext'
import { Redirect } from "react-router-dom"
import { FireAuth, FireGoogleAuthProvider } from 'config/Firebase'

import notif from 'components/NotificationPopUp/notif'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockIcon from '@material-ui/icons/Lock'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import "styles/loaders/loaders.scss"

const Loading = () => {
    return(
        <div className="ball-pulse">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}
class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            change: false,
            loading: false,
            googleLoading: false,
            githubLoading: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleLoading = this.handleLoading.bind(this)
        this.signInWithGoogle = this.signInWithGoogle.bind(this)
    }

    handleLoading = (req, action) => {
        this.setState({
            ...this.state,
            [req]: action
        })
    }

    signInWithGoogle () {
        const props = this.props
        
        this.handleLoading('googleLoading', true)

        FireAuth.signInWithPopup(FireGoogleAuthProvider).then(res => {
            const profile = res.additionalUserInfo.profile

            if (res.additionalUserInfo.isNewUser) {
                const profileData = {
                    uid: res.user.uid,
                    fullName: profile.name,
                    email: profile.email,
                    photoUrl: profile.picture
                }

                props.userUpdateProfile(profileData)
                .then(res => {
                    FireAuth.currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                        props.signIn({token: idToken}).then(res => {
                            this.handleLoading('googleLoading', false)
                            props.setIsLoggin(true)
                        })
                        .catch(err => {
                            this.handleLoading('loading', false)
                            notif('error', 'Error 500!' , 'Server Error! Please contact your Administrator')
                        })
                    }).catch(err => {
                        this.handleLoading('loading', false)
                        notif('error', 'Error 500!' , 'Server Error! ' + err + 'Please contact your Administrator')
                    })
                }).catch(err => {
                    notif('error', 'Error 500!' , 'An error occurred while sending new data! Please contact your Administrator')
                    this.handleLoading('googleLoading', false)
                })
            } else {
                FireAuth.currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                    props.signIn({token: idToken}).then(res => {
                        this.handleLoading('googleLoading', false)
                        props.setIsLoggin(true)
                    })
                    .catch(err => {
                        this.handleLoading('loading', false)
                        notif('error', 'Error 500!' , 'Server Error! Please contact your Administrator')
                    })
                }).catch(err => {
                    this.handleLoading('loading', false)
                    notif('error', 'Error 500!' , 'Server Error! ' + err + 'Please contact your Administrator')
                })
            }
        }).catch(err => {
            this.handleLoading('googleLoading', false)
            notif('error', 'Error!' , 'An error occurred while trying to sign in with Google! Please contact your Administrator')
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        const props = this.props
        const t     = e.target.elements
        const email = t.email.value.trim()
        const pass  = t.pass.value.trim()

        this.handleLoading('loading', true)

        FireAuth.signInWithEmailAndPassword(email, pass)
        .then(res => {
            if (res.user.emailVerified) {
                FireAuth.currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                    props.signIn({token: idToken}).then(res => {
                        this.handleLoading(false)
                        props.setIsLoggin(true)
                    })
                    .catch(err => {
                        this.handleLoading('loading', false)
                        notif('error', 'Error 500!' , 'Server Error! Please contact your Administrator')
                    })
                }).catch(err => {
                    this.handleLoading('loading', false)
                    notif('error', 'Error 500!' , 'Server Error! ' + err + 'Please contact your Administrator')
                })
            } else {
                this.handleLoading('loading', false)
                notif('warning', 'Warning', 'Your email account is not verified! Please check your email to verify you account.')
            }
        })
        .catch(err => {
            this.handleLoading('loading', false)
            notif('error', 'Sign In Failed!' , err.message)
        })
    }

  render() {
    if(this.props.isLoggedIn)
        return <Redirect push to='/app/dashboard' />
    
    return (
        <section className="form-v1-container full-width">
            <h2 style={{color: ''}} className="text-primary">Login to Continue</h2>
            <p className="lead text-dark">Welcome back<br></br> Sign In with your <b className="text-primary ">SMLC Cloud Platform</b> account</p>
            <div className="col-md-10 mx-auto">
                <Button 
                    onClick={this.signInWithGoogle} 
                    disabled={this.state.googleLoading ? true : false} 
                    className="btn-cta btn-block text-white" 
                    variant="contained" startIcon={this.state.googleLoading ? false : <GoogleOutlined />} 
                    style={this.state.googleLoading ? {backgroundColor: '#EF9A9A'} : {backgroundColor: '#DD2C00'}}
                >
                    {this.state.googleLoading ? <Loading /> : 'SignIn With Google'}
                </Button>
                <Button 
                    className="btn-cta btn-block text-white" 
                    variant="contained" startIcon={<GithubOutlined />} 
                    style={{backgroundColor: '#212121'}}
                >
                    SignIn With GitHub
                </Button>
                
                <div className="divider divider-with-content text-primary my-4"><span className="divider-inner-content">OR</span></div>

                <form onSubmit={this.handleSubmit} className="form-v1">
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <AccountCircleIcon color="primary" />
                            </div>
                            <TextField                                   
                            id="login1-name"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            autoComplete="off"
                            placeholder="Your email address"
                            required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <LockIcon color="primary" />
                            </div>
                            <TextField                                    
                            id="login1-password"
                            label="Password"
                            name="pass"
                            type="password"
                            fullWidth
                            autoComplete="off"
                            placeholder="Your password account"
                            required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Button disabled={this.state.loading ? true : false} variant="contained" size="medium" color="primary" type="submit" className="btn-cta btn-block">
                            {this.state.loading ? <Loading /> : 'Log In'}
                        </Button>
                    </div>
                </form>
            </div>
        
            <p className="additional-info text-dark">Don't have an account yet? <Link to="/user/signup">Sign up</Link></p>
            <p className="additional-info text-dark">Forgot your username or password? <Link to="/user/reset">Reset password</Link></p>
        </section>
    );
  }
}

export default withAuth(LoginForm);
