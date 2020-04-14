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

    updateData() {
        const { axios, server_url, location } = this.props
        const id = location.hash.replace('#', '')
        
        axios.get(`${server_url}/api/graph/${id}`)
        .then((res) => {
            this.setState({ data: {...res.data}})
        })
        .catch((err) => {
            this.setState({ err_data: 1})
        });
    }

    componentDidMount() {        
        this.updateData()
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
        const { location } = this.props
        const { data, err_data } = this.state

        if ( data === '' && err_data === 0) {
            return <div><LinearProgress color="primary" /></div>
        } else if (data === '' && err_data === 1) {
            return <div>Error fetching data. Please refresh this pages!</div>
        }

        return (
            <Fragment>
                <ModalEdit {...this.state} updateData={this.updateData} closeEditModal={this.closeEditModal}/>
                <ModalWidget {...this.state} updateData={this.updateData} closeWidgetModal={this.closeWidgetModal}/>      
                
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-xs-12 col-md-6 d-flex justify-content-center justify-content-md-start">
                            <h5><b><span className="ui-highlight" style={{backgroundColor: '#FF9800'}}><MaterialIcon icon="bubble_chart" style={{color: '#FFFFFF'}} /> {data.graph}</span></b></h5>
                        </div>
                        <div className="col-xs-12 col-md-6 d-flex justify-content-center justify-content-md-end">
                            <Tooltip title="Add Widget">
                                <IconButton aria-label="Add Widget" size="medium" onClick={this.showWidgetModal}>
                                    <MaterialIcon icon="add_circle" style={{color: '#00BCD4'}}></MaterialIcon>
                                </IconButton>
                            </Tooltip>
                            <Link to="/app/visualization#show" >
                                <Tooltip title="Graph List">
                                    <IconButton aria-label="Graph List" size="medium">
                                        <MaterialIcon icon="view_list" style={{color: '#4CAF50'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Tooltip title="Settings">
                                <IconButton aria-label="Settings" size="medium" onClick={this.showEditModal}>
                                    <MaterialIcon icon="settings" style={{color: '#FF9800'}}></MaterialIcon>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="col-xs-12 col-md-12">
                            <ChartTemplate widgetData={this.state.data.graph_widget} graphId={location.hash.replace('#', '')} updateData={this.updateData} />
                        </div>
                    </div>
                </div>              
            </Fragment>         
        )
    }
}

export default withAuth(Graph)