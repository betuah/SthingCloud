import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import notif, { deleteConfirm } from 'components/NotificationPopUp/notif'
import 'echarts/theme/macarons';

class Tachometer extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false

        this.state = {
            widgetTitle: '',
            dataValue: 0,
            display: {
                min: 0,
                max: 100
            }
        }

        this.deleteWidget = this.deleteWidget.bind(this)
        this.editWidget = this.editWidget.bind(this)
        this.normalise = this.normalise.bind(this)
    }
    
    componentDidMount() {
        this._isMounted = true
        const { widgetTitle, resourceId, dataId, dataValue, display, socket } = this.props

        this._isMounted && this.setState({
            widgetTitle: widgetTitle,
            dataValue: dataValue,
            display: display
        })

        socket.on(`${resourceId}-${dataId}`, resData => {
            this._isMounted && this.setState({
                dataValue: resData.value
            })
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.widgetTitle === this.state.widgetTitle && this.state.dataValue === nextState.dataValue ? ( this.props.Editable === nextProps.Editable ? (nextProps.display.min === this.state.display.min || nextProps.display.min === this.state.display.min ? false : true) : true ) : true
    }

    componentDidUpdate() {
        const { widgetTitle, display } = this.props
        this._isMounted && this.setState({
            ...this.state,
            widgetTitle: widgetTitle,
            display: display
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    normalise = value => (value - this.state.display.min) * 100 / (this.state.display.max - this.state.display.min)

    editWidget() {
        const { _id, showEditModal } = this.props

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
        let gauge = {};

        gauge.option = {
            tooltip: {
                formatter: '{a} <br/>{b} : {c}'
            },
            toolbox: {
                show: true,
            },
            series: [
                {
                    name: `${this.state.widgetTitle}`,
                    type: 'gauge',
                    detail: {formatter: '{value}'},
                    data: [{value: Number(this.normalise(this.state.dataValue).toFixed(2)), name: 'Value'}],
                    title: {
                        textStyle: {
                                color: '#898989'
                        }
                    }
                }
            ]
        };

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
                            <div className="col-12">
                                <ReactEcharts option={gauge.option} theme={"macarons"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withAuth(Tachometer);