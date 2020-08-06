import React, { Component, Fragment } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Redirect } from "react-router-dom";
import { withAuth } from 'components/Auth/context/AuthContext';

import "./styles.scss"

class Welcome extends Component {
    componentDidMount() {
        this.props.checkToken();
    }
    
    render() {
        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />

        return (
            <Fragment>
                <section className="w-100 h-100">
                    <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center mx-auto dash-body text-center" style={{display: 'block'}}>
                            <QueueAnim>
                                <div key='1'><h2>Welcome</h2></div>
                                <div key='2'><h6>Automate your devices</h6></div>
                                <div key='3' className="col-12 divider-custom divider-dotted"></div>
                                <div key='4'><p>Access The <a className="brand link-animated-hover link-hover-v2 text-primary" rel="noopener noreferrer" target="_blank" href={'#/'}>Documentation</a> And Join Our <a className="brand link-animated-hover link-hover-v2 text-primary" target="_blank" rel="noopener noreferrer" href={'https://discord.gg/UxSHjJY'}>Community</a></p></div>
                            </QueueAnim>
                        </div>
                    </div>
                </section>    
            </Fragment>
        )
    }
}

export default withAuth(Welcome);