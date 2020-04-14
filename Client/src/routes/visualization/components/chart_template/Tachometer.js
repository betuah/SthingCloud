import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Box, Typography, IconButton, Tooltip } from '@material-ui/core'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import notif, { deleteConfirm } from 'components/NotificationPopUp/notif'
import 'echarts/theme/macarons'

class Tachometer extends Component {
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

    componentWillMount() {
        this._isMounted = true;
    }
    
    componentDidMount() {
        const { widgetTitle, resourceId, data, socket } = this.props
        this._isMounted && this.setState({
            widgetTitle: widgetTitle,
            dataValue: data[0].value
        })

        socket.on(`${resourceId}-${data[0].type}`, resData => {
            console.log('tacho')
            this._isMounted && this.setState({
                dataValue: resData.value
            })
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.widgetTitle === this.state.widgetTitle && this.state.dataValue === nextState.dataValue ? false : true
    }

    componentDidUpdate() {
        const { widgetTitle } = this.props
        this._isMounted && this.setState({
            widgetTitle: widgetTitle
        })
    }

    componentWillUnmount() {
        const { server_url, axios, graphId, _id } = this.props

        axios.put(`${server_url}/api/graph/widgetData/${graphId}/${_id}`, { value: this.state.dataValue })

        this._isMounted = false;
    }

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
                    data: [{value: this.state.dataValue, name: 'Value'}],
                    title: {
                        textStyle: {
                                color: '#898989'
                        }
                    }
                }
            ]
        };

        return (
            <div className="col-xs-12 col-md-3 p-2">
                <div className="box">
                    <Box 
                        className="box"
                        boxShadow={2}
                        bgcolor="background.paper"
                    >
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
                                <div className="col-12">
                                    <ReactEcharts option={gauge.option} theme={"macarons"} />
                                </div>
                            </div>
                        </div>               
                    </Box>
                </div>
            </div>
        )
    }
}

export default withAuth(Tachometer);