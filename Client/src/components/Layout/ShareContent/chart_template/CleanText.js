import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import { InitConfig } from 'components/Auth/context/ConfigContext'
import 'echarts/theme/macarons'

class CleanText extends Component {
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
    
        return (
            <div className="col-xs-12 col-md-12 p-1">
                <div className="card box">
                    <div className="p-2">
                        <div className="row">
                            <div className="col-10 d-flex justify-content-start">
                                <Typography noWrap>{this.state.widgetTitle}</Typography>
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

export default InitConfig(CleanText);