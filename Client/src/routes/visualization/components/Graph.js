import React, { Component, Fragment } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import MaterialIcon from 'components/MaterialIcon'
import { Link } from 'react-router-dom'
import { withAuth } from 'components/Auth/context/AuthContext'
import { IconButton, Tooltip, LinearProgress } from '@material-ui/core'


let ModalEdit = loadable({
    loader: () => import('./modals/ModalEdit'),
    loading: LoadingComponent
})

let ModalWidget = loadable({
    loader: () => import('./modals/ModalWidget'),
    loading: LoadingComponent
})

let ChartTemplate = loadable({
    loader: () => import('./chart_template'),
    loading: LoadingComponent
})

class Graph extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ModalWidget: false,
            ModalEdit: false,
            data: '',
            input: '',
            err_data: 0
        }
        
        this.updateData         = this.updateData.bind(this)
        this.showEditModal      = this.showEditModal.bind(this)
        this.closeEditModal     = this.closeEditModal.bind(this)
        this.showWidgetModal    = this.showWidgetModal.bind(this)
        this.closeWidgetModal   = this.closeWidgetModal.bind(this)
    }

    updateData(id) {
        const { axios, server_url }  = this.props
        axios.get(`${server_url}/api/graph/${id}`)
        .then((res) => {
            this.setState({ data: {...res.data}})
        })
        .catch((err) => {
            this.setState({ err_data: 1})
        });
    }

    componentDidMount() {    
        const { location }  = this.props
        const graphId   = location.hash.replace('#', '')
        this.updateData(graphId)
    }

    showEditModal() {
        this.setState({ ModalEdit: true })
    }

    closeEditModal() {
        this.setState({ ModalEdit: false })
    }

    showWidgetModal() {
        this.setState({ ModalWidget: true })
    }

    closeWidgetModal() {
        this.setState({ ModalWidget: false })
    }

    render() {
        const { data, err_data } = this.state
        if ( data === '' && err_data === 0) {
            return <div><LinearProgress color="primary" /></div>
        } else if (data === '' && err_data === 1) {
            return <div>Error fetching data...</div>
        }

        return (
            <Fragment>
                <ModalEdit {...this.state} updateData={this.updateData} closeEditModal={this.closeEditModal}/>
                <ModalWidget {...this.state} updateData={this.updateData} closeWidgetModal={this.closeWidgetModal}/>      
                
                <div className="box box-default mb-12"> 
                    <div className="box-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 style={{color: '#2196F3'}}><b>{data.graph}</b></h4>
                            </div>
                            <div className="col-md-6 text-right">
                                <Tooltip title="Add Widget">
                                    <IconButton aria-label="Add Widget" onClick={this.showWidgetModal}>
                                        <MaterialIcon icon="add_circle" style={{color: '#00BCD4'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                                <Link to="/app/visualization#show" >
                                    <Tooltip title="Graph List">
                                        <IconButton aria-label="Graph List">
                                            <MaterialIcon icon="view_list" style={{color: '#4CAF50'}}></MaterialIcon>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                                <Tooltip title="Settings">
                                    <IconButton aria-label="Settings" onClick={this.showEditModal}>
                                        <MaterialIcon icon="settings" style={{color: '#FF9800'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>                    
                    </div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        
                    </div>
                </div>
                <ChartTemplate widgetData={this.state.data.graph_widget} />
            </Fragment>         
        )
    }
}

export default withAuth(Graph)