import React, { Component, Fragment } from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import MaterialIcon from 'components/MaterialIcon'
import { TextField, Button, Radio, FormLabel, FormControlLabel } from '@material-ui/core'
import { FireDatabase } from 'config/Firebase'
import notif from 'components/NotificationPopUp/notif'

import 'styles/loaders/loaders.scss'

const Loading = () => {
    return(
        <div className="ball-pulse">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}
class PersonalForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            uid: false,
            email: '',
            data: {
                fullName: '',
                gender: 'male',
                address: '',
                organization: '',
                profession: '',
                photoUrl: false
            },
            modalForm: {
                password: '',
                confirmPassword: ''
            }
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleLoading = this.handleLoading.bind(this)
    }

    componentDidMount = async () => {
        const { initUser } = this.props
        const profile = JSON.parse(localStorage.getItem('profileData'))

        initUser()

        this.setState({
            uid: profile.uid,
            email: profile.email,
            data: {
                ...this.state.data,
                fullName: profile.fullName,
                gender: profile.gender === '' ? 'male' : profile.gender,
                address: profile.address,
                organization: profile.organization,
                profession: profile.profession,
                photoUrl: profile.photoUrl
            }
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        if(name === 'password' || name === 'confirmPassword') {
            this.setState({
                modalForm: {
                    ...this.state.modalForm,
                    [name]: value
                }
            })
        } else {
            this.setState({
                data: {
                    ...this.state.data,
                    [name]: value
                }
            })
        }
    }

    handleLoading = (action) => {
        this.setState({
            loading: action
        })
    }

    handleOk = (e) => {
        e.preventDefault()

        this.handleLoading(true)

        const { uid, data } = this.state
        const userDb = FireDatabase.ref(`users/${uid}/personalData`)

        userDb.update({
            ...data
        }).then(res => {
            this.handleLoading(false)
            notif('success', 'Success!' , 'Your data changes have been saved.')
        }).catch(err => {
            this.handleLoading(false)
            notif('error', 'Failed!' , 'Failed saving data.')
        })
    }

    render() {
        const { email, data, loading } = this.state

        return (
            <Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-md-12">
                            <div className="row justify-content-center">
                                <form onSubmit={this.handleOk} className="form-v1 col-xs-12 col-md-8">
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="assignment_ind" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="fullName"
                                                name="fullName"
                                                label="Full Name"
                                                type="text"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}
                                                required
                                                placeholder="Your full name"
                                                value={data.fullName}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="email" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="email"
                                                name="email"
                                                label="Email"
                                                type="email"
                                                fullWidth
                                                autoComplete="off"
                                                required
                                                placeholder="Your email address"
                                                value={email}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <FormLabel component="legend">Gender</FormLabel>
                                            <FormControlLabel value="male" control={
                                                <Radio
                                                    checked={data.gender === 'male'}
                                                    onChange={this.handleChange}
                                                    value="male"
                                                    name="gender"
                                                    aria-label="Male"
                                                    color="primary"
                                                />
                                            } label="Male" />
                                            <FormControlLabel value="female" control={
                                                <Radio
                                                    checked={data.gender === 'female'}
                                                    onChange={this.handleChange}
                                                    value="female"
                                                    name="gender"
                                                    aria-label="Female"
                                                    color="primary"
                                                />
                                            } label="Female" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="engineering" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="profession"
                                                name="profession"
                                                label="Profession"
                                                type="text"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}                                            
                                                placeholder="ex: Software Engineering, IoT Developer, Data Scientist and etc"
                                                value={data.profession}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="apartment" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="organization"
                                                name="organization"
                                                label="Organization"
                                                type="text"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}                                            
                                                placeholder="Your organization name"
                                                value={data.organization}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <TextField                                   
                                                id="address"
                                                name="address"
                                                label="Address"
                                                type="text"
                                                multiline
                                                maxrows="4"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}                                            
                                                placeholder="Your home or organization address"
                                                value={data.address}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex justify-content-center">
                                        <Button className="col-md-4" variant="contained" color="primary" type="submit" disabled={loading}>{loading.loadingBtnSave ? <Loading /> : 'Save Change'}</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(PersonalForm)