import React, { Component, Fragment } from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import MaterialIcon from 'components/MaterialIcon'
import { TextField, Button, Radio, FormLabel, FormControlLabel } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import notif from 'components/NotificationPopUp/notif'

class Settings extends Component {
    constructor(props) {
        super(props)

        const tzData = JSON.parse(localStorage.getItem('timeZoneList')) ? JSON.parse(localStorage.getItem('timeZoneList')) : []

        this.state = {
            data: {
                timeZone: '',
                host: '',
                port: '',
                secure: '1',
                tls: '1',
                username: '',
                password: '',
                oldPassword: ''
            },
            timeZoneList: [...tzData]
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleOk = this.handleOk.bind(this)
    }

    async componentDidMount() {
        this.props.checkToken()
        const { axios, server_url } = this.props

        axios.get(`${server_url}/api/user/settings`).then(res => {
            this.setState({
                data: {
                    timeZone: res.data.timeZone,
                    host: res.data.smtp.host,
                    port: res.data.smtp.port,
                    secure: res.data.smtp.secure,
                    tls: res.data.smtp.tls,
                    username: res.data.smtp.username,
                    password: '',
                    oldPassword: res.data.smtp.password
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handleChange = (e, val) => {
        const { name, value } = e.target;

        if(val) {
            this.setState({
                data: {
                    ...this.state.data,
                    timeZone : val
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
        const { axios, server_url } = this.props
        const { data } = this.state
        
        axios.post(`${server_url}/api/user/settings`, data).then(res => {
            localStorage.setItem('timeZone', data.timeZone)
            notif('success', 'Success!' , 'Your data has been updated.')
        }).catch(err => {
            notif('error', 'Failed!' , 'Failed saving your data.')
        })
    }

    render() {
        const { data, timeZoneList } = this.state

        return (
            <Fragment>
                <div className="container-fluid mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="box box-default pt-5 pb-3 mdc-elevation--z2 col-xs-12 col-md-8">
                            <form onSubmit={this.handleOk} className="form-v1 row justify-content-center">
                                <div className="col-xs-12 col-md-8">
                                    <h6 className="text-grey">Time Zone Settings</h6>
                                    <div className="col-12 divider divider-dotted"></div>
                                    <div className="form-group">
                                        <Autocomplete
                                            options={timeZoneList.map((option) => option)}
                                            value={data.timeZone}
                                            name="timeZone"
                                            onChange={this.handleChange}
                                            renderInput={(params) => 
                                                <TextField 
                                                    {...params}
                                                    label="Time Zone"
                                                />
                                            }
                                        />
                                    </div>
                                    <h6 className="text-grey mt-5">SMTP Settings</h6>
                                    <div className="col-12 divider divider-dotted"></div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="local_post_office" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="host"
                                                name="host"
                                                label="HOST"
                                                type="text"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}                                            
                                                placeholder="ex: smtp.gmail.com"
                                                value={data.host}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="cloud" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="port"
                                                name="port"
                                                label="PORT"
                                                type="number"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}                                            
                                                placeholder="ex: 465"
                                                value={data.port}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <FormLabel component="legend">Secure</FormLabel>
                                            <FormControlLabel value={"1"} control={
                                                <Radio
                                                    checked={data.secure === "1"}
                                                    onChange={this.handleChange}
                                                    value={"1"}
                                                    name="secure"
                                                    aria-label="secure"
                                                    color="primary"
                                                />
                                            } label="True" />
                                            <FormControlLabel value={"2"} control={
                                                <Radio
                                                    checked={data.secure === "2"}
                                                    onChange={this.handleChange}
                                                    value={"2"}
                                                    name="secure"
                                                    aria-label="secure"
                                                    color="primary"
                                                />
                                            } label="False" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <FormLabel component="legend">TLS</FormLabel>
                                            <FormControlLabel value="1" control={
                                                <Radio
                                                    checked={data.tls === "1"}
                                                    onChange={this.handleChange}
                                                    value={"1"}
                                                    name="tls"
                                                    aria-label="tls"
                                                    color="primary"
                                                />
                                            } label="True" />
                                            <FormControlLabel value={"0"} control={
                                                <Radio
                                                    checked={data.tls === "0"}
                                                    onChange={this.handleChange}
                                                    value={"0"}
                                                    name="tls"
                                                    aria-label="tls"
                                                    color="primary"
                                                />
                                            } label="False" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="account_box" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="username"
                                                name="username"
                                                label="User Name"
                                                type="email"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}                                            
                                                placeholder="ex: sthing@gmail.com"
                                                value={data.username}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="lock" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="password"
                                                name="password"
                                                label="Password"
                                                type="password"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}                                            
                                                placeholder="Your password"
                                                value={data.password}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex justify-content-center">
                                        <Button className="col-md-4" variant="contained"> Send Test Mail </Button>
                                    </div>
                                    <div className="col-12 divider divider-dotted"></div>
                                    <div className="form-group d-flex justify-content-center">
                                        <Button className="col-md-4" variant="contained" color="primary" type="submit"> Save </Button>
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