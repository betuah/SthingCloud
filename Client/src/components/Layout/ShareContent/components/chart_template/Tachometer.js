import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Typography } from '@material-ui/core'
import { InitConfig } from 'components/Auth/context/ConfigContext'
import 'echarts/theme/macarons'

class Tachometer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            widgetTitle: '',
            dataValue: 0
        }
    }
    
    componentDidMount() {
        const { widgetTitle, resourceId, data, socket } = this.props
        this.setState({
            widgetTitle: widgetTitle,
            dataValue: data[0].value
        })

        socket.on(`${resourceId}-${data[0].type}`, resData => {
            this.setState({
                dataValue: resData.value
            })
        });
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
            <div className="col-xs-12 col-md-12 p-1">
                <div className="card box">
                    <div className="p-2">
                        <div className="row">
                            <div className="col-10 d-flex justify-content-start">
                                <Typography noWrap>{this.state.widgetTitle}</Typography>
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

export default InitConfig(Tachometer);