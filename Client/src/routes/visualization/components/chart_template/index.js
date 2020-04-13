import React, { Component } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
import { Grid } from '@material-ui/core'

let Gauge = loadable({
    loader: () => import('./Gauge'),
    loading: LoadingComponent
})

let ModalWidgetEdit = loadable({
    loader: () => import('../modals/ModalWidgetEdit'),
    loading: LoadingComponent
})

class Chart_template extends Component {
    constructor(props) {
        super(props)

        this.state = {
            widgetId: '',
            ModalEditWidget: false
        }

        this.showEditModal      = this.showEditModal.bind(this)
        this.closeEditModal     = this.closeEditModal.bind(this)
    }

    componentDidMount() {
        const { checkToken } = this.props
        checkToken();
    }

    showEditModal(id) {
        this.setState({ 
            widgetId: id,
            ModalEditWidget: true 
        })
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.ModalEditWidget !== nextState.ModalEditWidget
    // }

    closeEditModal() {
        this.setState({ 
            widgetId: '',
            ModalEditWidget: false 
        })
    }
    
    render() {
        const { widgetData, graphId, updateData } = this.props

        return (
            <div>
                { this.state.widgetId !== '' && 
                    <ModalWidgetEdit {...this.state} graphId={graphId} updateData={updateData} closeWidgetModal={this.closeEditModal} widgetData={widgetData} />
                }

                <Grid container spacing={2}>
                {
                    widgetData.map((e, i) => {
                        let template = null;

                        switch (e.widgetChart) {
                            case 'G': template = <Gauge key={i} {...e} graphId={graphId} updateData={updateData} widgetData={widgetData} showEditModal={this.showEditModal}/>
                            break;
                            case 'T': template = <Gauge key={i} {...e} graphId={graphId} updateData={updateData} widgetData={widgetData} showEditModal={this.showEditModal}/>
                            break;
                            default: template = null
                        }
                        
                        return template
                    })                     
                }
                </Grid>
            </div>
        )
    }
}

export default withAuth(Chart_template);