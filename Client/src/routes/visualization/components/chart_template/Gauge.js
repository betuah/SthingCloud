import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Box } from '@material-ui/core'
import 'echarts/theme/macarons'

class Chart extends Component {
    state = {
        widgetTitle: '',
        dataValue: 0
    }
    
    componentDidMount() {
        const { widgetTitle, dataValue } = this.props
        this.setState({
            widgetTitle: widgetTitle,
            dataValue: dataValue
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
                "center": ["50%", "77%"],
                "radius": 100,
                "axisLine": {
                    "lineStyle": {
                        "width": 25,
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
                    "width": 10,
                    "length": "70%",
                    "color": "#2d99e2"
                },
                "title": {
                    "show": true,
                    "offsetCenter": [1, "35%"],
                    "textStyle": {
                        "color": "#2d99e2",
                        "fontSize": 15,
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
            <Box 
                className="box"
                boxShadow={2}
                bgcolor="background.paper"
                p={2}
                m={1}
                style={{ width: '20%' }}
            >
                <h5 fontWeight="fontWeightBold">{this.state.widgetTitle}</h5>
                <ReactEcharts option={gauge.option} theme={"macarons"} style={{height: '170px'}} />
            </Box>
        )
    }
}

export default Chart;