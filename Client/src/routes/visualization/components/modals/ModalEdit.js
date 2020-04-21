import React, { Fragment, Component } from 'react'
import notif from 'components/NotificationPopUp/notif'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import { TextField, Button, Switch, FormControlLabel } from '@material-ui/core'
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
                                value={props.data.graph_name}
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
                                value={props.data.desc}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group-v1">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={props.data.share}
                                        onChange={props.onSwitch('share')}
                                        value={props.data.share ? '1' : '0'}
                                        color="primary"
                                        name='share'
                                    />
                                }
                                label="Share this graph"
                            />
                        </div>
                    </div>
                    <div style={props.data.share ? { display: 'block' } : { display: 'none' }} className="form-group">
                        <div className="input-group-v1">
                            <div className="input-group-icon">
                                <MaterialIcon icon="share" style={{color: '#00BCD4'}} />
                            </div>
                            <TextField                                    
                                id="sharedLink"
                                label="Shared Link"
                                name="shared_link"
                                type="text"
                                fullWidth
                                placeholder="Shared Graph Link"
                                value={props.data.share_link ? props.data.share_link : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                // disabled
                                readOnly={true}
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
        
        this.state = {
            data: {
                graph_name: '',
                desc: '',
                share: '',
                share_link: ''
            }
        }

        this.clearState = this.clearState.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSwitch = this.handleSwitch.bind(this)
    }

    componentDidMount() {
        const { data, client_url } = this.props
        this.setState({
            data: {
                graph_name: data.graph || '',
                desc: data.desc || '',
                share: data.share ? true : false,
                share_link: `${client_url}/graph/${data.userId}/${data._id}`
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

    handleSwitch = name => e => {
        this.setState({                 
            data: {
                ...this.state.data,
                [name]: e.target.checked 
            }                                
        })
    }

    handleOk = () => {
        const { server_url, axios, data } = this.props;
        axios.put(`${server_url}/api/graph/${data._id}`, this.state.data)
        .then(res => {
            this.clearState()
            notif('success', res.data.status , 'Success updating data!')          
        })
        .catch(err => {
            if(err.response) {
                const error = err.response.data;       
                notif(error.code === 11000 ? 'error' : 'warning', error.code === 11000 ? 'Error' : 'Warning', error.msg)
            } else {               
                const resMsg = { status: 'Error', code: 500, msg: `Internal Server Error : ${err}`}         
                notif('error', resMsg.status, resMsg.msg)
            }
        });         
    }

    clearState() {
        const { closeEditModal, updateData, data } = this.props
        closeEditModal()
        updateData(data._id)
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
                    <Content onChange={this.handleChange} onSwitch={this.handleSwitch} {...this.state} />
                </Modal> 
            </Fragment>
        )
    }
}

export default withAuth(ModalEditContent)