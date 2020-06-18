import React, { Component, Fragment } from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import MaterialIcon from 'components/MaterialIcon'
import { TextField, Button } from '@material-ui/core'
import { FireDatabase } from 'config/Firebase'
import notif from 'components/NotificationPopUp/notif'

class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
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
    }

    componentDidMount() {
        this.props.checkToken()

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

    handleOk = (e) => {
        e.preventDefault()

        const { uid, data } = this.state
        const userDb = FireDatabase.ref(`users/${uid}/personalData`)

        userDb.update({
            ...data
        }).then(res => {
            notif('success', 'Success!' , 'Your data changes have been saved.')
        }).catch(err => {
            notif('error', 'Failed!' , 'Failed saving data.')
        })
    }

    render() {
        const { data } = this.state

        return (
            <Fragment>
                <div className="container-fluid mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="box box-default pt-5 pb-3 mdc-elevation--z2 col-xs-12 col-md-8">
                            <form onSubmit={this.handleOk} className="form-v1 row justify-content-center">
                                <div className="col-xs-12 col-md-8">
                                    <h5 className="text-grey">SMTP Setup</h5>
                                    <hr></hr>
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
                                    <div className="form-group d-flex justify-content-center">
                                        <Button className="col-md-4" variant="contained" color="primary" type="submit"> Save Change </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(Settings)