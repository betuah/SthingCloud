import React, { Component, Fragment } from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import DEMO from 'constants/demoData'
import { Tabs, Tab } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'

class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tabIndexValues: 0,
        }

        this.handleChangeTabs   = this.handleChangeTabs.bind(this)
        this.handleChangeIndex  = this.handleChangeIndex.bind(this)
    }

    componentDidMount() {
        this.props.checkToken();
    }

    handleChangeTabs = (event, tabIndexValues) => {
        this.setState({ tabIndexValues });
    };
    
    handleChangeIndex = index => {
        this.setState({ tabIndexValues: index });
    };

    render() {
        const profile = DEMO.profiles[2];
        const { profileData } = this.props
        const { tabIndexValues } = this.state

        return (
            <Fragment>
                <div className="text-center text-body-reverse" style={{position: 'relative', paddingTop: '50px', paddingBottom: '50px'}}>
                    <div className="hero-bg-img" style={{backgroundColor: '#424242'}}></div>
                    <div className="hero-bg-img" style={{opacity: 0.6, backgroundImage: 'url(assets/flat-images/nature_flat_03.jpg)'}}></div>
                    <div style={{position: 'relative'}}>
                        <h3>User Profile</h3>
                    </div>
                </div>
                <div className="container-fluid mt-4 mb-3">
                    <div className="row">
                        <div className="col-lg-3">
                            <article className="profile-card-v2 border-0 mdc-elevation--z2 h-auto">
                                <img src={profile.avatar} alt="avatar"/>
                                <h4>{profileData.name}</h4>
                                <span>{profile.title}</span>
                                <p>{`+62 813 83073355 ${profileData.email} `}</p>
                            </article>
                        </div>
                        <div className="col-xs-12 col-lg-9 col-md-9">
                            <div className="box box-default mdc-elevation--z2 mb-3">
                                <div className="box-header">
                                    <Tabs value={tabIndexValues} onChange={this.handleChangeTabs} variant="fullWidth">
                                        <Tab label="Personal Information" />
                                        <Tab label="Photo Profile" />
                                        <Tab label="Password" />
                                    </Tabs>
                                </div>
                                <div className="box-body">
                                    <SwipeableViews
                                        index={tabIndexValues}
                                        onChangeIndex={this.handleChangeIndex}
                                    >
                                        <h1>Tab 1</h1>
                                        <h1>Tab 2</h1>
                                        <h1>Tab 3</h1>
                                    </SwipeableViews> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(Profile)