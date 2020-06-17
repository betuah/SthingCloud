import React, { Component, Fragment } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
import { Tabs, Tab } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'

let PersonalForm = loadable({
    loader: () => import('./PersonalForm'),
    loading: LoadingComponent
})

let PasswordForm = loadable({
    loader: () => import('./PasswordForm'),
    loading: LoadingComponent
})

let UploadPhoto = loadable({
    loader: () => import('./UploadPhoto'),
    loading: LoadingComponent
})
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
        this.props.checkToken()
    }

    handleChangeTabs = (event, tabIndexValues) => {
        this.setState({ tabIndexValues })
    };
    
    handleChangeIndex = index => {
        this.setState({ tabIndexValues: index })
    };

    render() {
        const profileData = JSON.parse(localStorage.getItem('profileData'))
        const { tabIndexValues } = this.state
        const { server_url } = this.props

        return (
            <Fragment>
                <div className="text-center text-body-reverse" style={{position: 'relative', paddingTop: '20px', paddingBottom: '20px'}}>
                    <div className="hero-bg-img" style={{backgroundColor: '#424242'}}></div>
                    <div className="hero-bg-img" style={{opacity: 0.6, backgroundImage: 'url(assets/flat-images/nature_flat_03.jpg)'}}></div>
                    <div className="custom-modal-title" style={{position: 'relative'}}>
                        <h3>User Profile</h3>
                    </div>
                </div>
                <div className="container-fluid mt-4 mb-3">
                    <div className="row">
                        <div className="col-lg-3 mb-3">
                            <article className="profile-card-v2 border-0 mdc-elevation--z2 h-auto">
                                <img 
                                    alt={profileData.fullName} 
                                    src={profileData.photoUrl ? (profileData.photoUrl.sourceId === 'api' ? `${server_url}/public/avatars/${profileData.photoUrl.url}` : profileData.photoUrl.url) : (profileData.gender === 'male' || profileData.gender === '' ? 'assets/avatars/male-avatar.png' : 'assets/avatars/female-avatar.png')} 
                                />
                                <h4>{profileData.fullName}</h4>
                                <span>{profileData.profession ? profileData.profession : '---'}</span>
                                <p>{profileData.email ? profileData.email : ''} <br /> {profileData.organization ? profileData.organization : ''}</p>
                            </article>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 ">
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
                                        <PersonalForm />
                                        <UploadPhoto />
                                        <PasswordForm />
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