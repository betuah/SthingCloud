import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import EmailIcon from '@material-ui/icons/Email';

class ResetForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e) => {
        e.preventDefault();
           
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
                                    fullWidth
                                    autoComplete="off"
                                    placeholder="Enter your email address"
                                    type="email"
                                />
                                </div>
                            </div>
                            <div className="form-group">
                                <Button variant="contained" color="primary" type="submit" className="btn-cta btn-block">
                                Send Reset Instructions
                                </Button>
                            </div>
                            </form>
                        </div>
                    </section>
                </div>
            </section>
        );
    }
}

export default ResetForm;