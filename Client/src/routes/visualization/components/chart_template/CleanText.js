import React, { Component } from 'react'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import notif, { deleteConfirm } from 'components/NotificationPopUp/notif'
import 'echarts/theme/macarons'

class CleanText extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false;

        this.state = {
            widgetTitle: '',
            dataValue: 0
        }

        this.deleteWidget = this.deleteWidget.bind(this)
        this.editWidget = this.editWidget.bind(this)
    }

    UNSAFE_componentWillMount() {
        this._isMounted = true;
    }
    
    componentDidMount() {
        const { widgetTitle, resourceId, dataId, dataValue, socket } = this.props
        this._isMounted && this.setState({
            widgetTitle: widgetTitle,
            dataValue: dataValue
        })

        socket.on(`${resourceId}-${dataId}`, resData => {
            this._isMounted && this.setState({
                dataValue: resData.value
            })
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.widgetTitle === this.state.widgetTitle && this.state.dataValue === nextState.dataValue ? ( this.props.Editable === nextProps.Editable ? false : true ) : true
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

    editWidget() {
        const { _id, showEditModal } = this.props
        console.log(this.props)

        showEditModal(_id)
    }

    deleteWidget() {
        deleteConfirm(confirm => {
            const { server_url, axios, graphId, _id, updateData } = this.props
            
            if (confirm)
                axios.delete(`${server_url}/api/graph/widget/${graphId}/${_id}`)
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
    
        return (
            <div className="col-xs-12 col-md-12 p-1">
                <div className="card box">
                    <div className="p-2">
                        <div className="row">
                            <div className="col-10 d-flex justify-content-start">
                                <Typography noWrap>{this.state.widgetTitle}</Typography>
                            </div>
                            <div className="col-2 d-flex justify-content-end">
                                <Tooltip title="Edit Widget" className={!this.props.Editable ? 'd-none' : ''}>
                                    <IconButton aria-label="edit" size="small" onClick={this.editWidget}>
                                        <MaterialIcon icon="edit" style={{color: '#FF9800'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Widget" className={!this.props.Editable ? 'd-none' : ''}>                                
                                    <IconButton aria-label="delete" size="small" onClick={this.deleteWidget}>
                                        <MaterialIcon icon="delete" style={{color: '#F44336'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className="col-12 d-flex">
                                <div className="w-100 align-self-center">
                                    <div className="d-flex justify-content-center" style={{color: '#00BCD4'}}>
                                        <b>
                                            <h4>{this.state.dataValue}</h4>
                                        </b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withAuth(CleanText);