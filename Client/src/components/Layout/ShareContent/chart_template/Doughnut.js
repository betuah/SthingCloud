import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Typography } from '@material-ui/core'
import { InitConfig } from 'components/Auth/context/ConfigContext'
import 'echarts/theme/macarons'

class Doughnut extends Component {
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
        let pie = {};

        pie.option = { 
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                x: 'left',
                data: ['Value', 'Remaining'],
                textStyle: {
                  color: '#898989'
                }
              },
            calculable: true,
            series: [
                {
                    name: this.state.widgetTitle,
                    type: 'pie',
                    radius: ['50%', '70%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            label: {
                                show: false,
                                position: 'center',
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    },
                    data: [
                        {value: this.state.dataValue > 100 ? 100 : this.state.dataValue, name: 'Value'},
                        {value: 100 - this.state.dataValue, name: 'Remaining'},
                    ]
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
                            <div className="col-12">
                                <ReactEcharts option={pie.option} theme={"macarons"} style={{height: '250px'}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InitConfig(Doughnut);