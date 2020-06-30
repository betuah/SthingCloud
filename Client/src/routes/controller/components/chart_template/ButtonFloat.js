import React, { Component } from 'react'
import { Typography, IconButton, Tooltip, Fab } from '@material-ui/core'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import notif, { deleteConfirm } from 'components/NotificationPopUp/notif'
import 'echarts/theme/macarons'
import PowerIcon from '@material-ui/icons/PowerSettingsNew';

class ButtonFloat extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false;

        this.state = {
            widgetTitle: '',
            btn_action: 0,
        }

        this.editWidget     = this.editWidget.bind(this)
        this.deleteWidget   = this.deleteWidget.bind(this)
        this.btnClick       = this.btnClick.bind(this)
    }

    componentWillMount() {
        this._isMounted = true;
    }
    
    componentDidMount() {
        const { widgetTitle, resourceId, dataValue, dataId, socket } = this.props
        this._isMounted && this.setState({
            widgetTitle: widgetTitle,
            btn_action: dataValue
        })

        socket.on(`${resourceId}-${dataId}`, resData => {
            this._isMounted && this.setState({
                btn_action: resData.value
            })
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.widgetTitle === this.state.widgetTitle && this.state.btn_action === nextState.btn_action ? ( this.props.Editable === nextProps.Editable ? false : true ) : true
    }

    componentDidUpdate() {
        const { widgetTitle } = this.props
        this._isMounted && this.setState({
            widgetTitle: widgetTitle
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    btnClick () {
        const { server_url, axios, controllerId, _id, resourceId } = this.props
        
        this._isMounted && axios.get(`${server_url}/api/device/${resourceId}`).then(res => {
            if(res.data.state === '1' || res.data.state === 1 ) {
                axios.put(`${server_url}/api/controller/widgetData/${controllerId}/${_id}`, { dataValue: !this.state.btn_action })
                .then(res => {
                    this._isMounted && this.setState({
                        btn_action: !this.state.btn_action
                    })
                }).catch(err => {
                    notif('warning', 'Failed', 'An error might have occurred on the internet network!')
                })
            } else {
                notif('error', 'Device Not Connect', 'Your device is not connected!')
            }
        })
    }

    editWidget() {
        const { _id, showEditModal } = this.props

        showEditModal(_id)
    }

    deleteWidget() {
        deleteConfirm(confirm => {
            const { server_url, axios, controllerId, _id, updateData } = this.props
            
            if (confirm)
                axios.delete(`${server_url}/api/controller/widget/${controllerId}/${_id}`)
                .then(res => {
                    updateData()
                    notif('success', res.data.status , 'Delete widget is success.')   
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }  

    render() {
        const { btn_action } = this.state

        return (
            <div className="col-xs-12 col-md-12 p-1">
                <div className="card box">
                    <div className="p-2">
                        <div className="row">
                            <div className="col-10 d-flex justify-content-start">
                                <Typography noWrap>{this.state.widgetTitle}</Typography>
                            </div>
                            <div className="col-2 d-flex justify-content-end">
                                <Tooltip title="Edit Widget" className={!this.props.Editable && 'd-none'}>
                                    <IconButton aria-label="edit" size="small" onClick={this.editWidget}>
                                        <MaterialIcon icon="edit" style={{color: '#FF9800'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Widget" className={!this.props.Editable && 'd-none'}>                                
                                    <IconButton aria-label="delete" size="small" onClick={this.deleteWidget}>
                                        <MaterialIcon icon="delete" style={{color: '#F44336'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className="col-12 p-2 d-flex justify-content-center">
                                <Fab size="large" aria-label="Power On" color={btn_action ? "primary" : 'default'} onClick={this.btnClick}>
                                    <PowerIcon />
                                </Fab>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withAuth(ButtonFloat);