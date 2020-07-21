import React from 'react'
import { Link } from 'react-router-dom'
import { withAuth } from '../Auth/context/AuthContext'
import { Redirect } from "react-router-dom"
import { FireAuth, FireGoogleAuthProvider, FireGithubAuthProvider } from 'config/Firebase'

import notif from 'components/NotificationPopUp/notif'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockIcon from '@material-ui/icons/Lock'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { GoogleOutlined, GithubOutlined } from '@ant-design/icons'
import { withStyles } from "@material-ui/core/styles"

import "styles/loaders/loaders.scss"
import "./styles.scss"

const Loading = () => {
    return(
        <div className="ball-pulse">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

const LoginTextField = withStyles({
    root: {
        '& label': {
            color: '#E3F2FD',
        },
        '& input' : {
            color: '#E3F2FD',
        },
        '& .MuiInput-root::before': {
            borderColor: '#64B5F6',
        },
        '& .MuiInput-root:hover::before': {
            borderColor: '#64B5F6',
        },
        '& label.Mui-focused': {
            color: '#E3F2FD',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#E3F2FD',
        }
    },
})(TextField)

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
        this.signInWithGithub = this.signInWithGithub.bind(this)
        this.updateProfile = this.updateProfile.bind(this)
    }

    handleLoading = (req, action) => {
        if (req === 'all') {
            this.setState({
                ...this.state,
                loading: action,
                googleLoading: action,
                githubLoading: action
            })
        } else {
            this.setState({
                ...this.state,
                [req]: action
            })
        }
    }

    updateProfile = profileData => {
        const { userUpdateProfile, signIn, setIsLoggin } = this.props

        userUpdateProfile(profileData)
        .then(res => {
            FireAuth.currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                signIn({token: idToken}).then(res => {
                    this.handleLoading('all', false)
                    setIsLoggin(true)
                })
                .catch(err => {
                    this.handleLoading('all', false)
                    notif('error', 'Error 500!' , 'Server Error! Please contact your Administrator')
                })
            }).catch(err => {
                this.handleLoading('all', false)
                notif('error', 'Error 500!' , `Server Error! ${err} Please contact your Administrator`)
            })
        }).catch(err => {
            notif('error', 'Error 500!' , 'An error occurred while sending new data! Please contact your Administrator')
            this.handleLoading('all', false)
        })
    }

    signInWithGoogle = () => {
        const props = this.props
        
        this.handleLoading('googleLoading', true)

        FireAuth.signInWithPopup(FireGoogleAuthProvider).then(res => {
            const profile = res.additionalUserInfo.profile

            const profileData = {
                uid: res.user.uid,
                fullName: profile.name,
                email: profile.email,
                photoUrl: {
                    sourceId: 'google',
                    url: profile.picture
                }
            }

            if (res.additionalUserInfo.isNewUser) {
                this.updateProfile(profileData)
            } else {
                FireAuth.currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                    props.signIn({token: idToken}).then(res => {
                        this.handleLoading('googleLoading', false)
                        props.setIsLoggin(true)
                    })
                    .catch(err => {
                        if (err.code === 404) {
                            this.updateProfile(profileData)
                        } else {
                            this.handleLoading('googleLoading', false)
                            notif('error', 'Error 500!' , 'Server Error! Please contact your Administrator')
                        }
                    })
                }).catch(err => {
                    this.handleLoading('googleLoading', false)
                    notif('error', 'Error 500!' , `Server Error! ${err} Please contact your Administrator`)
                })
            }
        }).catch(err => {
            this.handleLoading('googleLoading', false)
        })
    }

    signInWithGithub = () => {
        const props = this.props
        
        this.handleLoading('githubLoading', true)

        FireAuth.signInWithPopup(FireGithubAuthProvider).then(res => {
            const profile = res.additionalUserInfo.profile
            const user = res.user

            const profileData = {
                uid: res.user.uid,
                fullName: profile.name !== '' || profile.name !== null ? profile.name : profile.login,
                email: profile.email === '' || profile.name === null ? profile.email : user.email,
                photoUrl: {
                    sourceId: 'github',
                    url: profile.avatar_url
                }
            }

            if (res.additionalUserInfo.isNewUser) {
                this.updateProfile(profileData)
            } else {
                FireAuth.currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
                    props.signIn({token: idToken}).then(res => {
                        this.handleLoading('githubLoading', false)
                        props.setIsLoggin(true)
                    })
                    .catch(err => {
                        if (err.code === 404) {
                            this.updateProfile(profileData)
                        } else {
                            this.handleLoading('githubLoading', false)
                            notif('error', 'Error 500!' , 'Server Error! Please contact your Administrator')
                        }
                    })
                }).catch(err => {
                    this.handleLoading('githubLoading', false)
                    notif('error', 'Error 500!' , `Server Error! ${err} Please contact your Administrator`)
                })
            }
        }).catch(err => {
            this.handleLoading('githubLoading', false)
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
                    notif('error', 'Error 500!' , `Server Error! ${err} Please contact your Administrator`)
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
            <section className="form-v1-container full-width row">
                <div className="col-xs-12 col-md-12 mx-auto">
                    <center><img className="logo-bg-img-login" src="assets/logo/Logo-Login.png" alt="logo" /></center>
                    <p className="lead text-light">Sign In with your <b className="text-primary ">Sthing Cloud</b> account</p>
                </div>
                
                <div className="col-xs-12 col-md-6 mx-auto">
                    <center>
                        <Button 
                            onClick={this.signInWithGoogle} 
                            disabled={this.state.googleLoading ? true : false} 
                            className="btn-cta btn-block text-white" 
                            variant="contained" startIcon={this.state.googleLoading ? false : <GoogleOutlined />} 
                            style={this.state.googleLoading ? {backgroundColor: '#EF9A9A'} : {backgroundColor: '#DD2C00'}}
                        >
                            {this.state.googleLoading ? <Loading /> : 'Sign In with Google'}
                        </Button>
                        <Button 
                            onClick={this.signInWithGithub}
                            disabled={this.state.githubLoading ? true : false} 
                            className="btn-cta btn-block text-white" 
                            variant="contained" startIcon={this.state.githubLoading ? false : <GithubOutlined />} 
                            style={this.state.githubLoading ? {backgroundColor: '#404040'} : {backgroundColor: '#212121'}}
                        >
                            {this.state.githubLoading ? <Loading /> : 'Sign In with GitHub'}
                        </Button>
                    </center>

                    <div className="divider divider-with-content text-primary"><span className="divider-inner-content">OR</span></div>

                    <form onSubmit={this.handleSubmit} className="form-v1">
                        <div className="form-group">
                            <div className="input-group-v1">
                                <div className="input-group-icon">
                                    <AccountCircleIcon color="primary" />
                                </div>
                                <LoginTextField                                   
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
                                <LoginTextField                                    
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
                                {this.state.loading ? <Loading /> : 'Sign In'}
                            </Button>
                        </div>
                    </form>

                    <p className="additional-info text-light">Don't have an account yet? <Link className="text-light" to="/user/signup">Sign up</Link></p>
                    <p className="additional-info text-light">Forgot your username or password? <Link className="text-light" to="/user/reset">Reset password</Link></p>
                
                </div>
            </section>
        )
    }
}

export default withAuth(LoginForm)
