import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '../Auth/context/AuthContext'
import { Redirect } from "react-router-dom";

import notif from 'components/NotificationPopUp/notif';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            change: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }    

    handleSubmit = async (e) => {
        e.preventDefault();
        const t     = e.target.elements;
        const user  = t.username.value.trim();
        const pass  = t.pass.value.trim();
        const props = this.props;
        const data  = {
            username: user,
            password: pass
        }

        const res = await props.login(data);

        if (res.code === '406') {
            notif('warning', 'Warning' , res.msg)
        } else if (res.code === 400) {
            notif('error', res.status , res.msg)
        }
    }

  render() {
    if(this.props.isLoggedIn)
        return <Redirect push to='/app/dashboard' />

    return (
        <section className="form-card mdc-elevation--z1">
            <div className="form-card__body p-lg-5 p-4">
                <section className="form-v1-container ">
                    <h2 style={{color: ''}} className="text-primary">Login to Continue</h2>
                    <p className="lead text-dark">Welcome back<br></br> sign in with your <b className="text-primary ">SMLC Cloud Platform</b> account</p>
                    <div className="col-md-12 mx-auto">
                        <form onSubmit={this.handleSubmit} className="form-v1">
                            <div className="form-group">
                                <div className="input-group-v1">
                                    <div className="input-group-icon">
                                        <AccountCircleIcon color="primary" />
                                    </div>
                                    <TextField                                   
                                    id="login1-name"
                                    name="username"
                                    label="Email or Username"
                                    type="text"
                                    fullWidth
                                    autoComplete="off"
                                    placeholder="Your email or username"
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
                                <Button variant="contained" size="medium" color="primary" type="submit" className="btn-cta btn-block">
                                    Log in
                                </Button>
                            </div>
                        </form>
                    </div>
                
                    <p className="additional-info text-dark">Don't have an account yet? <Link to="/user/signup">Sign up</Link></p>
                    <p className="additional-info text-dark">Forgot your username or password? <Link to="/user/reset">Reset password</Link></p>
                </section>
            </div>
        </section>
    );
  }
}

export default withAuth(LoginForm);
