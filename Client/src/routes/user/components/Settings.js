import React, { Component, Fragment } from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import MaterialIcon from 'components/MaterialIcon'
import { TextField, Button, Radio, FormLabel, FormControlLabel } from '@material-ui/core'
import timeZoneList from 'constants/timeZoneList'
import Autocomplete from '@material-ui/lab/Autocomplete'
import notif from 'components/NotificationPopUp/notif'
import QueueAnim from 'rc-queue-anim'
import {  Modal } from 'antd'

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

const ModalContent = props => {
    return (
        <Fragment>
            <div className="col-md-12 mx-auto">
                <h4 style={{color: '#00BCD4'}} className="text-center"><b>Send Test Mail</b></h4>
                <div className="divider divider-dotted"></div>             
                <form className="form-v1" onSubmit={props.onSubmit}>
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="email" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                   
                                id="sendToMail"
                                name="sendToMail"
                                label="Send To"
                                type="email"
                                fullWidth
                                autoComplete="off"
                                onChange={props.onChange}
                                required
                                placeholder="Destination email address"
                                value={props.data.sendToMail}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                    <div className="divider divider-dotted"></div>
                    <div className="form-group d-flex justify-content-center">
                        <Button className="col-md-4" variant="contained" color="primary" type="submit" disabled={props.loading.loadingBtnModal}> {props.loading.loadingBtnModal ? <Loading /> : 'Send'} </Button>
                    </div>
                </form>                  
            </div>
        </Fragment>
    )
}
class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: {
                loadingBtnModal: false,
                loadingBtnSave: false,
                loadingBtnTestMail: false
            },
            modalTestMail: false,
            data: {
                sendToMail: '',
                timeZone: 'Asia/Jakarta',
                host: '',
                port: '',
                secure: 1,
                tls: 1,
                username: '',
                password: '',
                oldPassword: ''
            },
            timeZoneList: [...timeZoneList]
        }
        
        this.handleChange   = this.handleChange.bind(this)
        this.handleTimeZone = this.handleTimeZone.bind(this)
        this.handleOk       = this.handleOk.bind(this)
        this.sendTestMail   = this.sendTestMail.bind(this)
        this.showModal      = this.showModal.bind(this)
        this.clearState     = this.clearState.bind(this)
    }

    componentDidMount() {
        this.props.checkToken()
        const { axios, server_url } = this.props

        axios.get(`${server_url}/api/user/settings`).then(res => {
            this.setState({
                data: {
                    ...this.state.data,
                    timeZone: res.data.timeZone ? res.data.timeZone : 'Asia/Jakarta',
                    host: res.data.smtp.host,
                    port: res.data.smtp.port,
                    secure: res.data.smtp.secure,
                    tls: res.data.smtp.tls,
                    username: res.data.smtp.username,
                    password: '',
                    oldPassword: res.data.smtp.password ? 1 : 0
                }
            })
        }).catch(err => {
            console.log(err)
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

    handleTimeZone = (e, val) => {
        this.setState({
            data: {
                ...this.state.data,
                timeZone : val
            }
        })
    }

    handleLoading = (req, action) => {
        if (req === 'all') { // Reqest for all loading 
            this.setState({
                loading: {
                    loadingBtnModal: false,
                    loadingBtnSave: false,
                    loadingBtnTestMail: false
                }
            })
        } else { // Request for specified loading
            this.setState({
                loading: {
                    ...this.state.loading,
                    [req]: action
                }            
            })
        }
    }

    showModal = () => {
        this.handleLoading('loadingBtnTestMail', true)
        this.setState({ modalTestMail: true })
    }

    clearState = () => {
        this.setState({ 
            ...this.state,
            modalTestMail: false, 
            loading: {
                loadingBtnModal: false,
                loadingBtnSave: false,
                loadingBtnTestMail: false
            },
            data: {
                ...this.state.data,
                sendToMail: ''
            }
        })
    }

    sendTestMail = async (e) => {
        e.preventDefault()
        const { axios, server_url } = this.props
        const { data } = this.state

        this.handleLoading('loadingBtnModal', true)
        
        await axios.post(`${server_url}/api/user/sendtestmail`, data).then(res => {
            const resData = res.data

            this.clearState()
            this.handleLoading('all', false)

            if (resData.code === 200 ) {
                notif('success', 'Success!' , `Email was sent to ${resData.data.emailTo}.`)
            } else {
                notif('error', 'Failed!' , `${resData.msg ? resData.msg : 'Something is wrong with your settings, please check again!'}`)
            }
        }).catch(err => {
            this.handleLoading('all', false)
            this.clearState()
            notif('error', 'Error!' , `Internal Server Error`)
        })
    }

    handleOk = (e) => {
        e.preventDefault()
        const { axios, server_url } = this.props
        const { data } = this.state

        this.handleLoading('loadingBtnSave', true)
        
        axios.post(`${server_url}/api/user/settings`, data).then(res => {
            this.handleLoading('loadingBtnSave', false)
            localStorage.setItem('timeZone', data.timeZone)
            notif('success', 'Success!' , 'Your data has been updated.')
        }).catch(err => {
            this.handleLoading('loadingBtnSave', false)
            notif('error', 'Failed!' , 'Failed saving your data.')
        })
    }

    render() {
        const { data, timeZoneList, modalTestMail, loading } = this.state
        
        return (
            <Fragment>
                <Modal
                    visible={modalTestMail}
                    onOk={this.sendTestMail}
                    onCancel={this.clearState}
                    closable={true}
                    footer={false}
                >
                    <ModalContent {...this.state} onSubmit={this.sendTestMail} onChange={this.handleChange} />
                </Modal>
                <QueueAnim>
                    <div key='1' className="container-fluid mt-5 mb-5">
                        <div className="row justify-content-center">
                            <div className="box box-default pt-5 pb-3 mdc-elevation--z2 col-xs-12 col-md-8">
                                <form onSubmit={this.handleOk} className="form-v1 row justify-content-center">
                                    <QueueAnim className="col-xs-12 col-md-8">
                                        <h6 key='2' className="text-grey">Time Zone Settings</h6>
                                        <div key='3' className="col-12 divider divider-dotted"></div>
                                        <div key='4' className="form-group">
                                            <Autocomplete
                                                options={timeZoneList.map((option) => option)}
                                                value={data.timeZone}
                                                name="timeZone"
                                                onChange={this.handleTimeZone}
                                                renderInput={(params) => 
                                                    <TextField 
                                                        {...params}
                                                        label="Time Zone"
                                                    />
                                                }
                                            />
                                        </div>
                                        <h6 key='5' className="text-grey mt-5">SMTP Settings</h6>
                                        <div key='6' className="col-12 divider divider-dotted"></div>
                                        <div key='7' className="form-group">
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
                                        <div key='8' className="form-group">
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
                                        <div key='9' className="form-group">
                                            <div className="input-group-v1">
                                                <FormLabel component="legend">Secure</FormLabel>
                                                <FormControlLabel value={1} control={
                                                    <Radio
                                                        checked={Number(data.secure) === 1}
                                                        onChange={this.handleChange}
                                                        value={'1'}
                                                        name="secure"
                                                        aria-label="secure"
                                                        color="primary"
                                                    />
                                                } label="True" />
                                                <FormControlLabel value={0} control={
                                                    <Radio
                                                        checked={Number(data.secure) === 0}
                                                        onChange={this.handleChange}
                                                        value={'0'}
                                                        name="secure"
                                                        aria-label="secure"
                                                        color="primary"
                                                    />
                                                } label="False" />
                                            </div>
                                        </div>
                                        <div key='10' className="form-group">
                                            <div className="input-group-v1">
                                                <FormLabel component="legend">TLS</FormLabel>
                                                <FormControlLabel value={1} control={
                                                    <Radio
                                                        checked={Number(data.tls) === 1}
                                                        onChange={this.handleChange}
                                                        value={1}
                                                        name="tls"
                                                        aria-label="tls"
                                                        color="primary"
                                                    />
                                                } label="True" />
                                                <FormControlLabel value={0} control={
                                                    <Radio
                                                        checked={Number(data.tls) === 0}
                                                        onChange={this.handleChange}
                                                        value={0}
                                                        name="tls"
                                                        aria-label="tls"
                                                        color="primary"
                                                    />
                                                } label="False" />
                                            </div>
                                        </div>
                                        <div key='11' className="form-group">
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
                                        <div key='12' className="form-group">
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
                                        <div key='13' className="form-group d-flex justify-content-center">
                                            <Button className="col-md-4" variant="contained" disabled={loading.loadingBtnTestMail} onClick={this.showModal}>{loading.loadingBtnTestMail ? <Loading /> : 'Send Test Mail'}</Button>
                                        </div>
                                        <div key='14' className="col-12 divider divider-dotted"></div>
                                        <div key='15' className="form-group d-flex justify-content-center">
                                            <Button className="col-md-4" variant="contained" color="primary" type="submit" disabled={loading.loadingBtnSave}> {loading.loadingBtnSave ? <Loading /> : 'Save'} </Button>
                                        </div>
                                    </QueueAnim>
                                </form>
                            </div>
                        </div>
                    </div>
                </QueueAnim>
            </Fragment>
        )
    }
}

export default withAuth(Settings)