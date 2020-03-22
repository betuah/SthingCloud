import React, { Fragment, Component } from 'react'
import notif from 'components/NotificationPopUp/notif'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import { TextField, Button, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import {  Modal } from 'antd'

const Content = props => {
    return (
        <div>
            <div className="col-md-12 mx-auto">
                <h4 style={{color: '#00BCD4'}} className="text-center">Add <b>Widget</b></h4>
                <div className="divider divider-dotted"></div>             
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
                                <InputLabel htmlFor="resourceType">Widget data Resource</InputLabel>
                                <Select
                                    value={props.data.resourceType}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'resourceType',
                                            id: 'resourceType',
                                        }
                                    }
                                    required
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Select widget data resources</em>
                                    </MenuItem>
                                    {props.inputResource.map((item, i) => <MenuItem key={i} value={item.value}>{item.name}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group" style={props.data.resourceType === 0 ? { display: 'none' } : { display: 'block' }}>
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="resourceId">{props.data.resourceType === 1 ? "Device List" : (props.data.resourceType === 2 ? "Data Bucket List" : "Resource")}</InputLabel>
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
                                        <em>{props.data.resourceType === 1 ? "Select your device" : (props.data.resourceType === 2 ? "Select your data bucket" : "Select your Resource")}</em>
                                    </MenuItem>
                                    {props.deviceList.map((item, i) => <MenuItem key={i} value={item._id}>{`${item.device} (${item._id})`}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group" style={props.data.resourceId === 0 ? { display: 'none' } : { display: 'block' }}>
                        <div className="input-group-v1">                            
                            <FormControl fullWidth required>
                                <InputLabel htmlFor="widgetChart">Widget Template</InputLabel>
                                <Select
                                    value={props.data.widgetChart}
                                    onChange={props.onChange}
                                    inputProps={{
                                        name: 'widgetChart',
                                            id: 'widgetChart',
                                        }
                                    }
                                    required
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Select your chart template</em>
                                    </MenuItem>
                                    {props.chart.map((item, i) => <MenuItem key={i} value={item.code}>{item.value}</MenuItem>)}
                                </Select>
                            </FormControl>                            
                        </div>
                    </div>
                    <div className="form-group" style={props.data.widgetChart === 0 ? { display: 'none' } : { display: 'block' }}>
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

class ModalEditContent extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            data: {
                widgetTitle: '',
                resourceType: 0,
                resourceId: 0,
                widgetChart: 0,
                dataId: ''
            },
            chart: [
                { code: 'T', value: 'Tachometer' },
                { code: 'DC', value: 'Donut Chart' },
                { code: 'G', value: 'Gauge' },
                { code: 'PB', value: 'Progressbar' },
                { code: 'LI', value: 'Led Indicator' },
                { code: 'CL', value: 'Clean Text'}
            ],
            inputResource: [
                { value: 'DEVICE', name: 'From Device' }, 
                // { value: 'BUCKET', name: 'From Data Bucket' }
            ],
            deviceList: [],
            bucketList: []
        }

        this.clearState = this.clearState.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        })

        if (name === 'resourceType' && value === 'DEVICE') {
            const { server_url, axios } = this.props; 

            axios.get(`${server_url}/api/device`)
            .then((res) => {
                this.setState({
                    deviceList: [...res.data]
                })
            })
        }
    }

    handleOk = () => {
        const { server_url, axios, data, updateData } = this.props
        const { widgetTitle, resourceType, resourceId, widgetChart, dataId } = this.state.data 
    
        if (widgetTitle === '' || resourceType === 0 || resourceId === 0 || widgetChart === 0 || dataId === '') {
            notif('warning', 'Warning' , 'Please fill all required fields!')
        } else {
            axios.post(`${server_url}/api/graph/widget/${data._id}`, this.state.data)
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
                resourceType: 0,
                resourceId: 0,
                widgetChart: 0,
                dataId: ''
            },
            deviceList: [],
            bucketList: []
        })
    }

    render() {
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
                    <Content onChange={this.handleChange} {...this.state} />
                </Modal> 
            </Fragment>
        )
    }
}

export default withAuth(ModalEditContent)