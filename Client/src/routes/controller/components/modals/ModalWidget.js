import React, { Fragment, Component } from 'react'
import notif from 'components/NotificationPopUp/notif'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import { 
    TextField, 
    Button, 
    FormControl, 
    Select, 
    MenuItem, 
    InputLabel, } from '@material-ui/core'
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
class ModalWidget extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            data: {
                widgetTitle: '',
                resourceId: 0,
                widgetDisplay: 0,
                dataId: ''
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
                dataId: ''
            },
        })
    }

    render() {
        const { data }     = this.props
        const controllerId = data._id

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

                        <ContentWidget 
                            onChange={this.handleChange} 
                            id={controllerId} 
                            onSwitch={this.handleSwitch} 
                            {...this.state}
                        />
                    </div>
                </Modal> 
            </Fragment>
        )
    }
}

export default withAuth(ModalWidget)