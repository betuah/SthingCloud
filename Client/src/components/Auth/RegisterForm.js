import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import notif from '../NotificationPopUp/notif';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const props     = this.props;
        const t         = e.target.elements;
        const name      = t.name.value.trim();
        const username  = t.username.value.trim();
        const pass      = t.pass.value.trim();
        const email     = t.email.value.trim();
        // const agreement = t.agree.checked; // For get value use t.agree.value

        axios.post('http://localhost:8000/api/signup', {
            name: name,
            username: username,
            email: email,
            password: pass
        })
        .then(function (response) {
            // const res   = response.data;
            notif('sucess', 'Success', 'Your account has been created! Please check your email to activated your account!')
            props.history.push('/user/signin')
        })
        .catch(function (error) {
            if(error.response) {
                const res = error.response.data;
                
                notif('error', res.status, res.msg)
            } else {
                notif('warning', 'Error 500', 'Internal Server Error')
            }
        }); 
    }

  render() {

    return (
        <section className="form-card mdc-elevation--z1">
            <div className="form-card__body p-lg-5 p-4">
                <section className="form-v1-container ">
                    <h2 className="text-primary">Create an Account</h2>
                    <p className="lead text-dark">Discovering and connecting your things around the globe.</p>
                    <div className="col-md-12 mx-auto">
                    <form onSubmit={this.handleSubmit} className="form-v1">
                        <div className="form-group">
                            <div className="input-group-v1">
                            <div className="input-group-icon">
                                <AccountBoxIcon color="primary" />
                            </div>
                            <TextField
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
                                <AccountCircleIcon color="primary" />
                            </div>
                            <TextField
                                id="username"
                                label="Username"
                                fullWidth
                                autoComplete="off"
                                name="username"
                                placeholder="Pick your unique username"
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
                            <TextField
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
                            <TextField
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
                                label={<div>I have read the <Link to="/agreement">agreement</Link></div>}
                                name="agree"
                            />
                        </div>
                        <div className="form-group">
                            <Button variant="contained" color="primary" type="submit" className="btn-cta btn-block">
                            Sign Up
                            </Button>
                        </div>
                        </form>
                        <p className="additional-info text-dark">Already have an account? <Link to="/user/signin">Login</Link></p>
                    </div>
                </section>
            </div>
        </section>
    );
  }
}

export default RegisterForm;
