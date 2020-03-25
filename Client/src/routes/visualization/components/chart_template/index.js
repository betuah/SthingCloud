import React, { Component } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
import { Grid } from '@material-ui/core'

let Gauge = loadable({
    loader: () => import('./Gauge'),
    loading: LoadingComponent
})

class Chart_template extends Component {
    componentDidMount() {
        const { checkToken } = this.props
        checkToken();
    }
    
    render() {
        const { widgetData, graphId } = this.props

        return (
            <div>
                <Grid container spacing={2}>
                {
                    widgetData.map((e, i) => {
                        let template = null;

                        switch (e.widgetChart) {
                            case 'G': template = <Gauge key={i} {...e} graphId={graphId} />
                            break;
                            case 'T': template = <Gauge key={i} {...e} graphId={graphId}/>
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