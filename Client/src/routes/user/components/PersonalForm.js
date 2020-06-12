import React, { Component, Fragment } from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import MaterialIcon from 'components/MaterialIcon'
import { TextField, Button, Radio, FormLabel, FormControlLabel } from '@material-ui/core'
import { FireDatabase } from 'config/Firebase'

class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {
                fullName: '',
                email: '',
                gender: 'male',
                address: '',
                organization: '',
                profession: '',
                photoUrl: false
            }
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleOk = this.handleOk.bind(this)
    }

    componentDidMount() {
        const { profileData, initUser } = this.props

        initUser()

        this.setState({
            data: {
                ...this.state.data,
                fullName: profileData.fullName,
                email: profileData.email,
                gender: profileData.gender === '' ? 'male' : profileData.gender,
                address: profileData.address,
                organization: profileData.organization,
                profession: profileData.profession,
                photoUrl: profileData.photoUrl
            }
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        })
    }

    handleOk = async () => {
        const { uid } = this.props.profileData
        const user = FireDatabase.ref(`users/${uid}/personalData`)

        user.update({
            ...this.state.data
        })
    }

    render() {
        const { data } = this.state

        return (
            <Fragment>
                <div className="container-fluid full-width">
                    <div className="row">
                        <div className="col-md-12">
                            <form className="form-v1 col-md-8 mx-auto">
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
                                            onChange={this.handleChange}
                                            required
                                            placeholder="Your email address"
                                            value={data.email}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
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
                            </form>
                        </div>
                        <Button className="col-md-2 mx-auto" variant="contained" color="primary" onClick={this.handleOk}> Save Change </Button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(Profile)