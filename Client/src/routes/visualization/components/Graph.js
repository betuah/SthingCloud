import React, { Component, Fragment } from 'react'
import QueueAnim from 'rc-queue-anim'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import MaterialIcon from 'components/MaterialIcon'
import { Link } from 'react-router-dom'
import { withAuth } from 'components/Auth/context/AuthContext'
import { IconButton, Tooltip, LinearProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'


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

class Graph extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ModalWidget: false,
            ModalEdit: false,
            Editable: false,
            Dragable: false,
            data: '',
            input: '',
            err_data: 0
        }
        
        this.updateData         = this.updateData.bind(this)
        this.showEditModal      = this.showEditModal.bind(this)
        this.closeEditModal     = this.closeEditModal.bind(this)
        this.showWidgetModal    = this.showWidgetModal.bind(this)
        this.closeWidgetModal   = this.closeWidgetModal.bind(this)
        this.editableWidget     = this.editableWidget.bind(this)
        this.dragableWidget     = this.dragableWidget.bind(this)
    }

    updateData() {
        const { axios, server_url, match } = this.props
        const id = match.params.graphId
        
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

    editableWidget() {
        this.setState({
            Editable: !this.state.Editable
        })
    }

    dragableWidget() {
        this.setState({
            Dragable: !this.state.Dragable
        })
    }

    render() {
        const { match } = this.props
        const { data, err_data } = this.state

        if ( data === '' && err_data === 0) {
            return <div><LinearProgress color="primary" /></div>
        } else if (data === '' && err_data === 1) {
            return <div>Error fetching data. Please refresh this pages!</div>
        }

        return (
            <Fragment>
                <ModalEdit {...this.state} editableWidget={this.editableWidget} dragableWidget={this.dragableWidget} updateData={this.updateData} closeEditModal={this.closeEditModal}/>
                <ModalWidget {...this.state} updateData={this.updateData} closeWidgetModal={this.closeWidgetModal}/>  
                
                <div className="container-fluid">
                    <QueueAnim className="row align-items-center">
                        <div key="1" className="col-12 d-flex mt-3 justify-content-between align-items-center">
                            <div key="2">
                                <Typography variant="h5">
                                    <span className="ui-highlight font-weight-bold" style={{backgroundColor: '#FF9800'}}><MaterialIcon icon="bubble_chart" style={{color: '#FFFFFF'}} /> {data.graph}</span>
                                </Typography>
                            </div>
                            <div key="3">
                                <Tooltip title="Add Widget">
                                    <IconButton aria-label="Add Widget" size="medium" onClick={this.showWidgetModal}>
                                        <MaterialIcon icon="add_circle" style={{color: '#00BCD4'}}></MaterialIcon>
                                    </IconButton>
                                </Tooltip>
                                <Link to="/app/visualization/#show" >
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
                        </div>
                        <div key="4" className="col-12 divider divider-dotted"></div>
                        <div key="5" className="col-12">
                            <ChartTemplate {...this.state} graphId={match.params.graphId} updateData={this.updateData} />
                        </div>
                    </QueueAnim>
                </div>
            </Fragment>         
        )
    }
}

export default withAuth(Graph)