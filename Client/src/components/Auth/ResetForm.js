import React from 'react'
import { Link } from 'react-router-dom'
import { FireAuth } from 'config/Firebase'
import notif from '../NotificationPopUp/notif'
import { Button, TextField } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'

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
            notif('sucess', 'Success', 'Please check your email address to reset your password !')
            props.history.push('/user/signin')
        }).catch(err => {
            notif('error', 'Warning', err.message)
            this.handleLoading(false)
        })
    }

    render() {
        return (
            <section className="form-card mdc-elevation--z1">
                <div className="form-card__body p-lg-5 p-4">
                    <section className="form-v1-container ">
                        <h2 style={{color: ''}} className="text-primary">Forgot Password?</h2>
                        <p className="additional-info col-lg-10 mx-lg-auto mb-3 text-dark">Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p>
                        <div className="col-md-12 mx-auto">
                        <form onSubmit={this.handleSubmit} className="form-v1">
                            <div className="form-group">
                                <div className="input-group-v1">
                                <div className="input-group-icon">
                                    <EmailIcon color="primary" />
                                </div>
                                <TextField
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
                            <p className="additional-info text-dark">Go back to Sign In ? <Link to="/user/signin">Login</Link></p>
                        </div>
                    </section>
                </div>
            </section>
        );
    }
}

export default ResetForm;