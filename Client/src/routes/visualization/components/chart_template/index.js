import React, { Component } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
import { Box } from '@material-ui/core'

let Gauge = loadable({
    loader: () => import('./Gauge'),
    loading: LoadingComponent
})

class Chart_template extends Component {
    componentDidMount() {
        this.props.checkToken();
    }
    
    render() {
        const { widgetData } = this.props
        return (
            <div>
                <Box display="flex" flexWrap="wrap" mt={2}>
                    {
                        widgetData.map((e, i) => {
                            let template = null;

                            switch (e.widgetChart) {
                                case 'G': template = <Gauge key={i} dataValue={20} {...e} />
                                break;
                                case 'T': template = <Gauge key={i} dataValue={86} {...e}/>
                                break;
                                default: template = null
                            }
                            
                            return template
                        })                     
                    }
                </Box>
            </div>
        )
    }
}

export default withAuth(Chart_template);