import React, { Component } from 'react'
import { Typography, IconButton, Tooltip, Switch } from '@material-ui/core'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import notif, { deleteConfirm } from 'components/NotificationPopUp/notif'

class SwitchBtn extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false;

        this.state = {
            widgetTitle: '',
            btn_action: true,
        }

        this.editWidget     = this.editWidget.bind(this)
        this.deleteWidget   = this.deleteWidget.bind(this)
        this.handleSwitch   = this.handleSwitch.bind(this)
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

    handleSwitch = name => e => {
        this.setState({
            ...this.state,
            [name]: e.target.checked
        })
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
        const { server_url, axios, controllerId, _id } = this.props

        this._isMounted && axios.put(`${server_url}/api/controller/widgetData/${controllerId}/${_id}`, { dataValue: this.state.btn_action })

        this._isMounted = false;
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
                                <Tooltip title="Edit Widget">
                                    <IconButton aria-label="edit" size="small" onClick={this.editWidget}>
                                        <MaterialIcon icon="edit" style={{color: '#FF9800'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Widget">                                
                                    <IconButton aria-label="delete" size="small" onClick={this.deleteWidget}>
                                        <MaterialIcon icon="delete" style={{color: '#F44336'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className="col-12 p-2 d-flex justify-content-center">
                                <Switch
                                    checked={btn_action ? true : false}
                                    onChange={this.handleSwitch('btn_action')}
                                    value={btn_action}
                                    color="primary"
                                    name='btn_action'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withAuth(SwitchBtn);