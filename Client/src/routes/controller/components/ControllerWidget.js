import React, { Component, Fragment } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import MaterialIcon from 'components/MaterialIcon'
import { Link } from 'react-router-dom'
import { withAuth } from 'components/Auth/context/AuthContext'
import { IconButton, Tooltip, LinearProgress, Typography } from '@material-ui/core'

let ModalEdit = loadable({
    loader:() => import('./modals/ModalEdit'),
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

class ControllerWidget extends Component {
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
        const { axios, server_url, match } = this.props
        const id = match.params.controllerId
        
        axios.get(`${server_url}/api/controller/${id}`)
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
        // const { location } = this.props
        const { data, err_data } = this.state
        const { match } = this.props

        if ( data === '' && err_data === 0) {
            return <div><LinearProgress color="primary" /></div>
        } else if (data === '' && err_data === 1) {
            return <div>Error fetching data. Please refresh this pages!</div>
        }

        return (
            <Fragment>
                <ModalEdit {...this.state} updateData={this.updateData} closeEditModal={this.closeEditModal}/>
                <ModalWidget {...this.state} updateData={this.updateData} closeWidgetModal={this.closeWidgetModal}/>      
                
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-12 d-flex mt-3 justify-content-between align-items-center">
                            <div>
                                <Typography variant="h5">
                                    <span className="ui-highlight font-weight-bold" style={{backgroundColor: '#FF5722'}}><MaterialIcon icon="tune" style={{color: '#FFFFFF'}} /> {data.controller}</span>
                                </Typography>
                            </div>
                            <div>
                                <Tooltip title="Add Button">
                                    <IconButton aria-label="Add Widget" size="medium" onClick={this.showWidgetModal}>
                                        <MaterialIcon icon="add_circle" style={{color: '#00BCD4'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                                <Link to="/app/controller/#show" >
                                    <Tooltip title="Controller List">
                                        <IconButton aria-label="Controller List" size="medium">
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
                        </div>
                        <div className="col-12 divider divider-dotted"></div>
                        <div className="col-xs-12 col-md-12">
                            <ChartTemplate layouts={this.state.data.layouts} widgetData={data.controller_widget} controllerId={match.params.controllerId} updateData={this.updateData} />
                        </div>
                    </div>
                </div>              
            </Fragment>         
        )
    }
}

export default withAuth(ControllerWidget)