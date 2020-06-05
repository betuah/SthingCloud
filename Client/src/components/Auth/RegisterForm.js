import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withAuth } from '../Auth/context/AuthContext'
import notif from '../NotificationPopUp/notif'
import { FireAuth } from 'config/Firebase'
import { withStyles } from "@material-ui/core/styles"

import AccountBoxIcon from '@material-ui/icons/AccountBox'
import LockIcon from '@material-ui/icons/Lock'
import EmailIcon from '@material-ui/icons/Email'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import "styles/loaders/loaders.scss"

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

const Loading = () => {
    return(
        <div className="ball-pulse">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}
class RegisterForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleLoading = action => {
        this.setState({
           loading: action
       })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const props     = this.props
        const t         = e.target.elements
        const fullName  = t.name.value.trim()
        const pass      = t.pass.value.trim()
        const email     = t.email.value.trim()

        const data = {
            fullName: fullName,
            email: email,
            photoUrl: false
        }

        this.handleLoading(true)

        FireAuth.createUserWithEmailAndPassword(email, pass)
        .then(res => {
            props.userUpdateProfile({ ...data, uid: res.user.uid }).then(res => {
                this.handleLoading(false)
                notif('sucess', 'Success', 'Your account has been created! Please check your email to activated your account!')
                props.history.push('/user/signin')
            }).catch(err => {
                this.handleLoading(false)
                notif('error', 'Sign Up Failed!', err.message)
            })
        })
        .catch(err => {
            this.handleLoading(false)
            notif('error', 'Sign Up Failed!', err.message)
        })
    }

  render() {
    return (
        <section className="form-v1-container full-width">
            <h2 className="text-primary">Create an Account</h2>
            <p className="lead text-light">Discovering and connecting your things around the globe.</p>
            <div className="col-md-10 mx-auto">
            <form onSubmit={this.handleSubmit} className="form-v1">
                <div className="form-group">
                    <div className="input-group-v1">
                    <div className="input-group-icon">
                        <AccountBoxIcon color="primary" />
                    </div>
                    <LoginTextField
                        id="signup1-name"
                        label="Name"
                        fullWidth
                        autoComplete="off"
                        name="name"
                        placeholder="Your full name "
                        type="text"
                        required
                    />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group-v1">
                    <div className="input-group-icon">
                        <EmailIcon color="primary" />
                    </div>
                    <LoginTextField
                        id="signup1-email"
                        label="Email"
                        fullWidth
                        autoComplete="off"
                        type="email"
                        name="email"
                        placeholder="Your active email address"
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
                        id="signup1-password"
                        label="Password"
                        type="password"
                        fullWidth
                        autoComplete="off"
                        name="pass"
                        placeholder="Your new password"
                        required
                    />
                    </div>
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                value="agreement"
                                color="primary"
                                required
                            />                                
                        }
                        label={<div className="text-light">I have read the <Link className="text-primary" to="/agreement">agreement</Link></div>}
                        name="agree"
                    />
                </div>
                <div className="form-group">
                    <Button disabled={this.state.loading ? true : false} variant="contained" size="medium" color="primary" type="submit" className="btn-cta btn-block">
                            {this.state.loading ? <Loading /> : 'Sign Up'}
                    </Button>
                </div>
                </form>
                <p className="additional-info text-light">Already have an account? <Link className="text-light" to="/user/signin">Login</Link></p>
            </div>
        </section>
    )
  }
}

export default withAuth(RegisterForm);
