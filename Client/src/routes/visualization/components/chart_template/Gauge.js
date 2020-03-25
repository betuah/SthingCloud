import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Box, Grid } from '@material-ui/core'
import { withAuth } from 'components/Auth/context/AuthContext'
import 'echarts/theme/macarons'

class Chart extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false;

        this.state = {
            widgetTitle: '',
            dataValue: 0
        }
    }

    componentWillMount() {
        this._isMounted = true;
    }
    
    componentDidMount() {
        const { widgetTitle, resourceId, data, socket } = this.props
        this.setState({
            widgetTitle: widgetTitle,
            dataValue: data[0].value
        })

        socket.emit('join_room', resourceId )

        socket.on(`${data[0].type}`, resData => {
            this._isMounted && this.setState({
                dataValue: resData.value
            })
        });
    }

    componentWillUnmount() {
        const { server_url, axios, graphId, _id } = this.props

        axios.put(`${server_url}/api/graph/widgetData/${graphId}/${_id}`, { value: this.state.dataValue })

        this._isMounted = false;
    }

    render() {
        let gauge = {};

        gauge.option = {
            "toolbox": {
                "show": false,
                "feature": {
                    "mark": {
                    "show": true
                    },
                    "restore": {
                    "show": true
                    },
                    "saveAsImage": {
                    "show": true
                    }
                }
            },
            "series": [{
                "name": "KPI",
                "type": "gauge",
                "startAngle": 180,
                "endAngle": 0,
                "center": ["50%", "77%"],
                "radius": 100,
                "axisLine": {
                    "lineStyle": {
                        "width": 35,
                        "color": [[`${this.state.dataValue / 100}`, "#2d99e2"], [1, "#dce3ec"]]
                    }
                },
                "axisTick": {
                    "show": false
                },
                "axisLabel": {
                    "show": false
                },
                "splitLine": {
                    "show": false
                },
                "pointer": {
                    "show": false
                },
                "title": {
                    "show": true,
                    "offsetCenter": [0, 0],
                    "textStyle": {
                        "color": "#2d99e2",
                        "fontSize": 30,
                        "fontWeight": "bold"
                    }
                },
                "detail": {
                    "show": false
                },
                "data": [{
                    "value": this.state.dataValue,
                    "name": `${this.state.dataValue}`
                }]
            }]
        };

        return (
            <Grid item xs={12} sm={3}>
                <Box 
                    className="box"
                    boxShadow={2}
                    bgcolor="background.paper"
                    p={1}
                >
                    <Grid container>
                        <Grid item xs={12} sm={6} container justify="flex-start">
                            <b>{this.state.widgetTitle}</b>
                        </Grid>
                        <Grid item xs={12} sm={6} container justify="flex-end">
                            {this.state.widgetTitle}
                        </Grid>
                    </Grid>                    
                    <ReactEcharts option={gauge.option} theme={"macarons"} style={{height: '170px'}} />
                </Box>
            </Grid>
        )
    }
}

export default withAuth(Chart);