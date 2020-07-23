import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Typography } from '@material-ui/core'
import { InitConfig } from 'components/Auth/context/ConfigContext'
import 'echarts/theme/macarons'

class Chart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            widgetTitle: '',
            dataValue: 0
        }
    }
    
    componentDidMount() {
        const { widgetTitle, resourceId, dataId, dataValue, socket } = this.props
        this.setState({
            widgetTitle: widgetTitle,
            dataValue: dataValue
        })

        socket.on(`${resourceId}-${dataId}`, resData => {
            this.setState({
                dataValue: resData.value
            })
        })
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
                "center": ["50%", "67%"],
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
            <div className="col-xs-12 col-md-12 p-1">
                <div className="card box">
                    <div className="p-2">
                        <div className="row">
                            <div className="col-12 d-flex justify-content-start">
                                <Typography noWrap>{this.state.widgetTitle}</Typography>
                            </div>
                            <div className="col-12">
                                <ReactEcharts option={gauge.option} theme={"macarons"} style={{height: '200px'}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InitConfig(Chart);