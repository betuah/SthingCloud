import React from 'react';
import axios from 'axios';
import { Modal } from 'antd';
import notif from 'components/NotificationPopUp/notif';
import MaterialIcon from 'components/MaterialIcon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { TextField, Button, IconButton, Tooltip } from '@material-ui/core';

axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
})

const Content = (props) => {
    return (
        <div>            
            <div className="col-md-12 mx-auto">
                <h4 style={{color: ''}} className="text-primary text-center">Add <b>Device</b></h4>
                <div className="divider divider-dotted"></div>             
                <form className="form-v1">
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="developer_board" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                   
                                id="deviceName"
                                name="device"
                                label="Device Name"
                                type="text"
                                fullWidth
                                autoComplete="off"
                                onChange={props.onChange}
                                required
                                placeholder="Device Name"
                                value={props.dataValue.device}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="description" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                    
                                id="desc"
                                label="Device Description"
                                name="desc"
                                type="text"                                                           
                                fullWidth
                                autoComplete="off"
                                required
                                placeholder="Device Information"
                                onChange={props.onChange}
                                value={props.dataValue.desc}
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

class AddDevice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            data: {
                device: '',
                desc: ''
            }
        }

        this.showModal      = this.showModal.bind(this)
        this.handleOk       = this.handleOk.bind(this)
        this.handleChange   = this.handleChange.bind(this)
        this.clearState     = this.clearState.bind(this)
    }    

    showModal = () => {
        this.setState({
            visible: true,
        });
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

    clearState = () => {
        this.setState({ 
            visible: false,
            data: {
                device: '',
                desc: ''
            }
        });
    }

    handleOk = () => {
        const { updateData } = this.props;
        
        axios.post("http://localhost:8000/api/device", this.state.data)
        .then(res => {
            updateData()
            this.clearState()
            notif('success', res.data.status , 'Success saving data!')          
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

    render() {
        const { visible } = this.state;
        return (
            <div>
                <Tooltip title="Add Device"> 
                    <IconButton aria-label="Add Device" onClick={this.showModal}>
                        <AddCircleOutlineIcon color="primary" />
                    </IconButton>
                </Tooltip>
                <Modal
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.clearState}
                    closable={false}
                    footer={[
                        <Button key="back" color="primary" onClick={this.clearState}>Cancel</Button>,
                        <Button key="submit" variant="contained" color="primary" onClick={this.handleOk}> Save </Button>,
                    ]}
                >
                    <Content onChange={this.handleChange} dataValue={this.state.data} />
                </Modal>
            </div>
        );
    }
}

export default AddDevice;