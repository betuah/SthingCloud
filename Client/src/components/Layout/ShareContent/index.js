import React, { Component, Fragment } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { SmileOutlined } from '@ant-design/icons';
import APPCONFIG from 'constants/appConfig';
import { InitConfig } from 'components/Auth/context/ConfigContext'
import { LinearProgress } from '@material-ui/core'

let ChartTemplate = loadable({
    loader: () => import('./components/chart_template'),
    loading: LoadingComponent
})

class ShareContent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Editable: false,
            data: '',
            input: '',
            err_data: 0
        }
        
        this.updateData = this.updateData.bind(this)
    }

    updateData() {
        const { axios, server_url, match } = this.props
        const id = match.params.graphId
        const userId = match.params.userId
        
        axios.get(`${server_url}/api/sharegraph/${userId}/${id}`)
        .then((res) => {
            this.setState({ data: {...res.data}})
        })
        .catch((err) => {            
            this.setState({ err_data: 1 })            
        })
    }

    componentDidMount() {        
        this.updateData()
    }

    render() {
        const { match } = this.props
        const { data, err_data } = this.state

        if ( data === '' && err_data === 0) {
            return <div><LinearProgress color="primary" /></div>
        } else if (data === '' && err_data === 1) {
            return (
                <div className="w-100" style={{height: '100%', position: 'absolute'}}>
                    <div className="h-100 d-flex align-items-center justify-content-center">
                        <h5 className="text-primary">Sorry, This content is not shared! <SmileOutlined /></h5> 
                    </div>
                </div>
            )
        }

        return (
            <Fragment>                
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-xs-12 col-md-12">
                            <div className="text-center text-primary">
                                <h3>{this.state.data.graph}</h3>
                            </div>
                            <div className="divider divider-solid"></div>
                        </div>
                        <div className="col-xs-12 col-md-12">
                            <ChartTemplate userId={data.userId} layouts={data.layouts} widgetData={data.graph_widget} graphId={match.params.graphId} updateData={this.updateData} />
                        </div>
                        <div className="col-xs-12 col-md-12 pt-3">
                            <div className="divider divider-solid"></div>
                            <div className="h-100 d-flex justify-content-center align-items-center">
                                <p className="text-primary font-weight-bolder">POWERED BY © <a className="brand link-animated-hover link-hover-v2" rel="_blank" href={'#/'}>{APPCONFIG.brand} {APPCONFIG.year}</a></p>
                            </div>
                        </div>
                    </div>
                </div>              
            </Fragment>         
        )
    }
}

export default InitConfig(ShareContent)