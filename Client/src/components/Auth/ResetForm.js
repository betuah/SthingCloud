import React from 'react'
import { Link } from 'react-router-dom'
import { FireAuth } from 'config/Firebase'
import notif from '../NotificationPopUp/notif'
import { Button, TextField } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import { withStyles } from '@material-ui/core/styles'

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
class ResetForm extends React.Component {
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
        e.preventDefault()
        const props     = this.props

        const t         = e.target.elements
        const email     = t.email.value.trim()

        this.handleLoading(true)

        FireAuth.sendPasswordResetEmail(email)
        .then(res => {
            this.handleLoading(false)
            notif('sucess', 'Success', 'Please check your email address for reset the password !')
            props.history.push('/user/signin')
        }).catch(err => {
            notif('error', 'Warning', err.message)
            this.handleLoading(false)
        })
    }

    render() {
        return (
            <section className="form-v1-container full-width">
                <div className="col-md-12 mx-auto">
                    <h2 style={{color: ''}} className="text-primary">Forgot Password?</h2>
                    <p className="additional-info col-lg-10 mx-lg-auto mb-3 text-light">Enter the email address you used when you joined and we’ll send you instructions for reset the password.</p>
                </div>
                <div className="col-md-10 mx-auto">
                    <form onSubmit={this.handleSubmit} className="form-v1">
                        <div className="form-group">
                            <div className="input-group-v1">
                            <div className="input-group-icon">
                                <EmailIcon color="primary" />
                            </div>
                            <LoginTextField
                                id="resetpassword1-email"
                                label="Email"
                                name="email"
                                fullWidth
                                autoComplete="off"
                                placeholder="Enter your email address"
                                type="email"
                            />
                            </div>
                        </div>
                        <div className="form-group">
                            <Button disabled={this.state.loading ? true : false} variant="contained" size="medium" color="primary" type="submit" className="btn-cta btn-block">
                                {this.state.loading ? <Loading /> : 'Send Reset Instructions'}
                            </Button>
                        </div>
                    </form>
                    <p className="additional-info text-light">Go back to Sign In ? <Link className="text-light" to="/user/signin">Login</Link></p>
                </div>
            </section>
        )
    }
}

export default ResetForm;