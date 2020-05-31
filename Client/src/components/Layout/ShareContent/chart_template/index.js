import React, { Component } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { InitConfig } from 'components/Auth/context/ConfigContext'
import { Responsive, WidthProvider } from "react-grid-layout";

import './style.css'

const ReactGridLayout = WidthProvider(Responsive);

let Gauge = loadable({
    loader: () => import('./Gauge'),
    loading: LoadingComponent
})

let Tachometer = loadable({
    loader: () => import('./Tachometer'),
    loading: LoadingComponent
})

let Doughnut = loadable({
    loader: () => import('./Doughnut'),
    loading: LoadingComponent
})

let ProgressBar = loadable({
    loader: () => import('./ProgressBar'),
    loading: LoadingComponent
})

let CleanText = loadable({
    loader: () => import('./CleanText'),
    loading: LoadingComponent
})

class Chart_template extends Component {
    constructor(props) {
        super(props)

        this.state = {
            layouts: {}
        }
    }

    componentDidMount() {
        const { layouts, socket, userId } = this.props
        this.setState({ layouts });
        socket.emit('join_room', userId ) 
    }
    
    render() {
        const { widgetData, graphId } = this.props
        return (
            <div>
                <ReactGridLayout 
                    margin={[0, 0]}
                    containerPadding={[0, 0]}
                    isDraggable={false}
                    isResizable={false}
                    items={5}
                    rowHeight={50}
                    preventCollision={true}
                    compactType='horizontal'
                    verticalCompact={true}
                    breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                    cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                    layouts={this.state.layouts}
                >
                    {
                        widgetData.map((e, i) => {
                            let template = null;
                            let sumbuX =  0
                            let sumbuY =  0
                            
                            switch (e.widgetChart) {
                                case 'G': 
                                    template =                                         
                                        <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 3, h: 5}} >
                                            <Gauge {...e} graphId={graphId} widgetData={widgetData} />
                                        </div>
                                break;
                                case 'T': 
                                    template = 
                                        <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 3, h: 7}} >
                                            <Tachometer {...e} graphId={graphId} widgetData={widgetData}/>
                                        </div>
                                break;
                                case 'DC': 
                                    template = 
                                        <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 3, h: 6}} >
                                            <Doughnut {...e} graphId={graphId} widgetData={widgetData}/>
                                        </div>
                                break;                                
                                case 'PB': 
                                    template = 
                                        <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 6, h: 2}} >
                                            <ProgressBar {...e} graphId={graphId} widgetData={widgetData}/>
                                        </div>
                                break;
                                case 'CL': 
                                    template = 
                                    <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 3, h: 2}} >
                                            <CleanText {...e} graphId={graphId} widgetData={widgetData}/>
                                        </div>
                                break;
                                default: template = <div key={i}></div>
                            }
                            
                            return template
                        })                     
                    }
                </ReactGridLayout>
            </div>
        );
    }
}

export default InitConfig(Chart_template);