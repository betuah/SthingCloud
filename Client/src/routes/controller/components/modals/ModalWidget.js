import React, { Fragment, Component } from 'react'
import notif from 'components/NotificationPopUp/notif'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import SwipeableViews from 'react-swipeable-views'
import { 
    TextField, 
    Button, 
    FormControl, 
    Select, 
    MenuItem, 
    InputLabel, 
    Switch,
    FormControlLabel,
    Tabs, 
    Tab } from '@material-ui/core'
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
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="http" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                   
                                id="api"
                                name="api"
                                label="End Point"
                                type="text"
                                fullWidth
                                autoComplete="off"
                                value={`${props.api_url}/api/iot/${props.id}/${props.data.dataId === '' ? '{Data Type Name}' : props.data.dataId}`}
                                disabled
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
            <div className="w-100 mt-4">
                <form className="form-v1">
                    <div className="form-group">
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="widgetTarget">{'Widget Target'}</InputLabel>
                                <Select
                                    value={props.data.eventOnWidgetTarget}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'eventOnWidgetTarget',
                                            id: 'eventOnWidgetTarget',
                                        }
                                    }
                                    required
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Select your button</em>
                                    </MenuItem>
                                    {props.widgetList.map((item, i) => <MenuItem key={i} value={item._id}>{`${item.widgetTitle}`}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="action">{'Action Target'}</InputLabel>
                                <Select
                                    value={props.data.eventOnActionTarget}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'eventOnActionTarget',
                                            id: 'eventOnActionTarget',
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
                    <div className="form-group ml-2">
                        <div className="input-group-v1">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={props.data.eventOnActive}
                                        onChange={props.onSwitch('eventOnActive')}
                                        value={props.data.share}
                                        color="primary"
                                        name='eventOnActive'
                                    />
                                }
                                label="Activate"
                            />
                        </div>
                    </div>
                </form>                  
            </div>
            <div className="divider divider-dotted"></div>
        </div>
    )
}

const ContentEventOff = props => {
    return (
        <div>
            <div className="w-100 mt-4">
                <form className="form-v1">
                    <div className="form-group">
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="widgetTarget">{'Widget Target'}</InputLabel>
                                <Select
                                    value={props.data.eventOnWidgetTarget}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'eventOffWidgetTarget',
                                            id: 'eventOffWidgetTarget',
                                        }
                                    }
                                    required
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Select your button</em>
                                    </MenuItem>
                                    {props.widgetList.map((item, i) => <MenuItem key={i} value={item._id}>{`${item.widgetTitle}`}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="action">{'Action Target'}</InputLabel>
                                <Select
                                    value={props.data.eventOnActionTarget}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'eventOffActionTarget',
                                            id: 'eventOffActionTarget',
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
                    <div className="form-group ml-2">
                        <div className="input-group-v1">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={props.data.eventOnActive}
                                        onChange={props.onSwitch('eventOnActive')}
                                        value={props.data.share}
                                        color="primary"
                                        name='eventOffActive'
                                    />
                                }
                                label="Activate"
                            />
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
                eventOnWidgetTarget: 0,
                eventOnActionTarget: 0,
                eventOnActive: false,
                eventOffWidgetTarget: 0,
                eventOffActionTarget: 0,
                eventOffActive: false
            },
            btn: [
                { code: 'BTN', value: 'Button' },
                { code: 'BTN_FLT', value: 'Floating Button' },
                { code: 'SW', value: 'Switch' }
            ],
            widgetList: [],
            deviceList: []
        }

        this.clearState         = this.clearState.bind(this)
        this.handleChange       = this.handleChange.bind(this)
        this.handleSwitch       = this.handleSwitch.bind(this)
        this.handleChangeTabs   = this.handleChangeTabs.bind(this)
        this.handleChangeIndex  = this.handleChangeIndex.bind(this)
    }

    componentDidMount() {
        const { server_url, axios, data } = this.props
        const widgetList = data.controller_widget

        axios.get(`${server_url}/api/device`)
        .then((res) => {
            this.setState({
                deviceList: [...res.data]
            })
        })

        this.setState({
            widgetList: [...widgetList]
        })
    }

    handleSwitch = name => e => {
        this.setState({                 
            data: {
                ...this.state.data,
                [name]: e.target.checked 
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

    handleChangeTabs = (event, tabIndexValues) => {
        this.setState({ tabIndexValues });
    };
    
    handleChangeIndex = index => {
        this.setState({ tabIndexValues: index });
    };

    handleOk = () => {
        const { server_url, axios, data, updateData } = this.props
        const { widgetTitle, resourceType, resourceId, widgetChart, dataId } = this.state.data 
    
        if (widgetTitle === '' || resourceType === 0 || resourceId === 0 || widgetChart === 0 || dataId === '') {
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
        updateData(data._id)
        this.setState({
            data: {
                widgetTitle: '',
                resourceId: 0,
                widgetDisplay: 0,
                dataId: '',
                eventOnWidgetTarget: 0,
                eventOnActionTarget: 0,
                eventOnActive: false,
                eventOffWidgetTarget: 0,
                eventOffActionTarget: 0,
                eventOffActive: false
            },
        })
    }

    render() {
        const { tabIndexValues }  = this.state
        const { api_url, data }   = this.props
        const controllerId        = data._id

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
                        <h4 style={{color: '#00BCD4'}} className="text-center">Edit <b>Button</b></h4>
                        <div className="divider divider-dotted"></div>  
                        <Tabs value={tabIndexValues} onChange={this.handleChangeTabs} variant="fullWidth">
                            <Tab label="Widget" />
                            <Tab label="Event On" />
                            <Tab label="Event Off" />
                        </Tabs>
                        <SwipeableViews
                            index={tabIndexValues}
                            onChangeIndex={this.handleChangeIndex}
                        >
                            <ContentWidget onChange={this.handleChange} api_url={api_url} id={controllerId} onSwitch={this.handleSwitch} {...this.state} />
                            <ContentEventOn onChange={this.handleChange} onSwitch={this.handleSwitch} {...this.state} />
                            <ContentEventOff onChange={this.handleChange} onSwitch={this.handleSwitch} {...this.state} />
                        </SwipeableViews> 
                    </div>
                </Modal> 
            </Fragment>
        )
    }
}

export default withAuth(ModalWidget)