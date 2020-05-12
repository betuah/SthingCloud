import React, { Fragment, Component } from 'react'
import notif from 'components/NotificationPopUp/notif'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import SwipeableViews from 'react-swipeable-views'
import { TextField, Button, FormControl, Select, MenuItem, InputLabel, Tabs, Tab, Switch, FormControlLabel } from '@material-ui/core'
import {  Modal } from 'antd'

const ContentWidget = props => {
    return (
        <div>
            <div className="w-100 mt-4">
                <form className="form-v1">
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="bubble_chart" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                   
                                id="widget"
                                name="widgetTitle"
                                label="Widget Title"
                                type="text"
                                fullWidth
                                autoComplete="off"
                                onChange={props.onChange}
                                required
                                placeholder="Widget Title"
                                value={props.data.widgetTitle}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="resourceId">{"Device"}</InputLabel>
                                <Select
                                    value={props.data.resourceId}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'resourceId',
                                            id: 'resourceId',
                                        }
                                    }
                                    required                                    
                                >
                                    <MenuItem value={0} disabled>
                                        <em>{"Select your device"}</em>
                                    </MenuItem>
                                    {props.deviceList.map((item, i) => <MenuItem key={i} value={item._id}>{`${item.device} (${item._id})`}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="widgetDisplay">{'Controller Display'}</InputLabel>
                                <Select
                                    value={props.data.widgetDisplay}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'widgetDisplay',
                                            id: 'widgetDisplay',
                                        }
                                    }
                                    required
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Select your button</em>
                                    </MenuItem>
                                    {props.btn.map((item, i) => <MenuItem key={i} value={item.code}>{`${item.value}`}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="settings_ethernet" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                   
                                id="dataId"
                                name="dataId"
                                label="Data Type name"
                                type="text"
                                fullWidth
                                autoComplete="off"
                                onChange={props.onChange}
                                required
                                placeholder="Your data type name"
                                value={props.data.dataId}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                </form>                  
            </div>
            <div className="divider divider-dotted"></div>
        </div>
    )
}

const ContentEventOn = props => {
    return (
        <div>
            {/* {console.log(props)} */}
            <div className="w-100 mt-4">
                <form className="form-v1">
                    <div className="form-group">
                        <div className="input-group-v1">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={props.data.share}
                                        onChange={props.onSwitch}
                                        value={props.data.share ? '1' : '0'}
                                        color="primary"
                                        name='share'
                                    />
                                }                                
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">                         
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="controllerSource">{"Destination Target Controller"}</InputLabel>
                                <Select
                                    value={props.data.controllerSource}
                                    onChange={props.onChange}
                                    inputProps={
                                        {
                                            name: 'controllerSource',
                                            id: 'controllerSource',
                                        }
                                    }
                                    required                                    
                                >
                                    <MenuItem value={0} disabled>
                                        <em>{"Select Controller"}</em>
                                    </MenuItem>
                                    {props.controllerList.map((item, i) => <MenuItem key={i} value={item._id}>{`${item.controller} - (${item._id})`}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group" style={props.data.controllerSource === 0 ? { display: 'none' } : { display: 'block' }}>
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="widgetTarget">{'Widget Target'}</InputLabel>
                                <Select
                                    value={props.data.widgetTarget}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'widgetTarget',
                                            id: 'widgetTarget',
                                        }
                                    }
                                    required
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Select your button</em>
                                    </MenuItem>
                                    {props.widgetList.map((item, i) => <MenuItem key={i} value={item._id}>{`${ props.data.triggerSource === 'DV' ? item.graph : item.controller}`}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group" style={props.data.widgetTarget === 0 ? { display: 'none' } : { display: 'block' }}>
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="action">{'Action'}</InputLabel>
                                <Select
                                    value={props.data.action}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'action',
                                            id: 'action',
                                        }
                                    }
                                    required
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Select action</em>
                                    </MenuItem>
                                    <MenuItem key={1} value={1}>On</MenuItem>
                                    <MenuItem key={2} value={2}>Off</MenuItem>
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                </form>                  
            </div>
            <div className="divider divider-dotted"></div>
        </div>
    )
}

class ModalWidget extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            tabIndexValues: 0,
            eventOnActive: '',
            data: {
                widgetTitle: '',
                resourceId: 0,
                widgetDisplay: 0,
                dataId: '',
                widgetTarget: 0,
                controllerSource: 0,
                action: 0,
                share: ''
            },
            btn: [
                { code: 'BTN', value: 'Button' },
                { code: 'BTN_FLT', value: 'Floating Button' },
                { code: 'SW', value: 'Switch' }
            ],
            controllerList: [],
            widgetList: [],
            deviceList: []
        }

        this.clearState         = this.clearState.bind(this)
        this.handleChange       = this.handleChange.bind(this)
        this.handleChangeTabs   = this.handleChangeTabs.bind(this)
        this.handleChangeIndex  = this.handleChangeIndex.bind(this)
        this.handleChageSwitch  = this.handleChageSwitch(this)
    }

    componentDidMount() {
        const { server_url, axios } = this.props; 

        axios.get(`${server_url}/api/device`)
        .then((res) => {
            this.setState({
                deviceList: [...res.data]
            })
        })

        axios.get(`${server_url}/api/controller`)
        .then((res) => {
            this.setState({
                controllerList: [...res.data]
            })
            // console.log(this.state.controllerList)
        })
    }

    handleChangeTabs = (event, tabIndexValues) => {
        this.setState({ tabIndexValues });
    };
    
    handleChangeIndex = index => {
        this.setState({ tabIndexValues: index });
    };

    handleChageSwitch = (e) => {
        
        // console.log(e)
        // this.setState({
        //     data: {
        //         ...this.state.data,
        //         [name]: e.target.checked 
        //     }
        // })
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

    handleOk = () => {
        const { server_url, axios, data, updateData } = this.props
        const { widgetTitle, resourceId, widgetDisplay, dataId } = this.state.data 
    
        if (widgetTitle === '' || resourceId === 0 || widgetDisplay === 0 || dataId === '') {
            notif('warning', 'Warning' , 'Please fill all required fields!')
        } else {
            axios.post(`${server_url}/api/controller/widget/${data._id}`, this.state.data)
            .then(res => {
                this.clearState()
                notif('success', res.data.status , 'Success Adding New Widget.')
                updateData(data._id)
            })
            .catch(err => {
                if(err.response) {
                    const error = err.response.data;       
                    notif(error.code === 11000 ? 'error' : 'warning', error.code === 11000 ? 'Error' : 'Warning', error.msg)
                } else {               
                    const resMsg = { status: 'Error', code: 500, msg: 'Internal Server Error'}         
                    notif('error', resMsg.status, resMsg.msg)
                }
            });
        }       
    }

    clearState() {
        const { closeWidgetModal, updateData, data } = this.props
        closeWidgetModal()
        this.setState({
            tabIndexValues: 0,
            data: {
                widgetTitle: '',
                resourceId: 0,
                widgetDisplay: 0,
                dataId: '',
                widgetTarget: 0,
                controllerSource: 0,
                action: 0
            }
        })        
        updateData(data._id)
    }

    render() {
        const { tabIndexValues } = this.state
        return (
            <Fragment>
                <Modal
                    visible={this.props.ModalWidget}
                    onOk={this.handleOk}
                    onCancel={this.clearState}
                    closable={false}
                    footer={[
                        <Button key="back" color="primary" onClick={this.clearState}>Cancel</Button>,
                        <Button key="submit" variant="contained" color="primary" onClick={this.handleOk}> Save </Button>,
                    ]}
                >
                    <div className="col-md-12">
                        <h4 style={{color: '#00BCD4'}} className="text-center">Add <b>Button</b></h4>
                        <div className="divider divider-dotted"></div>   
                        <Tabs value={tabIndexValues} onChange={this.handleChangeTabs} variant="fullWidth">
                            <Tab label="Widget" />
                            <Tab label="Event On" />
                        </Tabs>
                        <SwipeableViews
                            index={tabIndexValues}
                            onChangeIndex={this.handleChangeIndex}
                        >
                            <ContentWidget onChange={this.handleChange} {...this.state} />
                            <ContentEventOn ontheway={this.handleChageSwitch} onChange={this.handleChange} {...this.state} />
                        </SwipeableViews>
                    </div>
                </Modal> 
            </Fragment>
        )
    }
}

export default withAuth(ModalWidget)