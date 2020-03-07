import React, { Fragment, Component } from 'react'
import notif from 'components/NotificationPopUp/notif'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import { TextField, Button } from '@material-ui/core'
import {  Modal } from 'antd'

const Content = props => {
    return (
        <Fragment>
            <div className="col-md-12 mx-auto">
                <h4 style={{color: '#FF9800'}} className="text-center">Update <b>Graph</b></h4>
                <div className="divider divider-dotted"></div>             
                <form className="form-v1">
                    <div className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="insert_chart" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                   
                                id="graph"
                                name="graph_name"
                                label="Graph Name"
                                type="text"
                                fullWidth
                                autoComplete="off"
                                onChange={props.onChange}
                                required
                                placeholder="Name of Graph"
                                value={props.dataValue.graph_name}
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
                                label="Graph Description"
                                name="desc"
                                type="text"                                                           
                                fullWidth
                                autoComplete="off"
                                required
                                placeholder="Graph Description"
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
        </Fragment>
    )
}

class ModalEditContent extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            data: {
                graph_name: props.data.graph,
                desc: props.data.desc,
                share_status: ''
            }
        }

        this.clearState = this.clearState.bind(this)
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
        const { updateData, server_url, axios, data } = this.props;
        
        axios.put(`${server_url}/api/graph/${data._id}`, this.state.data)
        .then(res => {
            updateData()
            this.clearState()
            notif('success', res.data.status , 'Success updating data!')          
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

    clearState() {
        const { closeEditModal, updateData, data } = this.props
        closeEditModal()
        updateData(data._id)
        this.setState({ 
            visible: false,
            data: {
                graph_name: data.graph,
                desc: data.desc
            }
        });        
    }

    render() {
        return (
            <Fragment>
                <Modal
                    visible={this.props.ModalEdit}
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
            </Fragment>
        )
    }
}

export default withAuth(ModalEditContent)