import React, { Component } from 'react'
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
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

let ModalWidgetEdit = loadable({
    loader: () => import('../modals/ModalWidgetEdit'),
    loading: LoadingComponent
})
class Chart_template extends Component {
    constructor(props) {
        super(props)

        this._isMounted = true;

        this.state = {
            widgetId: '',
            ModalEditWidget: false,
            editableWidget: props.Editable,
            layouts: JSON.parse(localStorage.getItem('widgetLayouts')) ? JSON.parse(localStorage.getItem('widgetLayouts')) : {}
        }

        this.showEditModal      = this.showEditModal.bind(this)
        this.closeEditModal     = this.closeEditModal.bind(this)
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentDidMount() {
        const { checkToken, layouts } = this.props
        checkToken();
        this._isMounted && this.setState({ layouts });
    }

    showEditModal(id) {
        this._isMounted && this.setState({ 
            widgetId: id,
            ModalEditWidget: true 
        })
    }

    onLayoutChange(layout, layouts) {
        this._isMounted && this.setState({ layouts });
    }

    componentWillUnmount() {
        const { server_url, axios, graphId } = this.props;

        const data = {
            layouts: {
                ...this.state.layouts
            }
        }
        
        this._isMounted && axios.put(`${server_url}/api/graph_layouts/${graphId}`, data)
        .catch(err => {
            if(err.response) {
                const error = err.response.data;       
                console.log(error.code === 11000 ? 'error' : 'warning', error.code === 11000 ? 'Error' : 'Warning', error.msg)
            } else {               
                const resMsg = { status: 'Error', code: 500, msg: 'Internal Server Error'}         
                console.log('error', resMsg.status, resMsg.msg)
            }
        });

        this._isMounted = false;
    }

    closeEditModal() {
        this.setState({ 
            widgetId: '',
            ModalEditWidget: false 
        })
    }
    
    render() {
        const { widgetData, graphId, updateData, Editable } = this.props
        return (
            <div>
                { this.state.widgetId !== '' && 
                    <ModalWidgetEdit {...this.state} graphId={graphId} updateData={updateData} closeWidgetModal={this.closeEditModal} widgetData={widgetData} />
                }

                <ReactGridLayout 
                    margin={[0, 0]}
                    containerPadding={[0, 0]}
                    isDraggable={true}
                    isResizable={false}
                    items={5}
                    rowHeight={50}
                    preventCollision={true}
                    compactType='horizontal'
                    verticalCompact={true}
                    breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                    cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                    layouts={this.state.layouts}
                    onLayoutChange={(layout, layouts) =>
                        this.onLayoutChange(layout, layouts)
                    }
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
                                            <Gauge {...e} graphId={graphId} Editable={Editable} updateData={updateData} widgetData={widgetData} showEditModal={this.showEditModal}/>
                                        </div>
                                break;
                                case 'T': 
                                    template = 
                                        <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 3, h: 7}} >
                                            <Tachometer {...e} graphId={graphId} Editable={Editable} updateData={updateData} widgetData={widgetData} showEditModal={this.showEditModal}/>
                                        </div>
                                break;
                                case 'DC': 
                                    template = 
                                        <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 3, h: 6}} >
                                            <Doughnut {...e} graphId={graphId} Editable={Editable} updateData={updateData} widgetData={widgetData} showEditModal={this.showEditModal}/>
                                        </div>
                                break;                                
                                case 'PB': 
                                    template = 
                                        <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 6, h: 2}} >
                                            <ProgressBar {...e} graphId={graphId} Editable={Editable} updateData={updateData} widgetData={widgetData} showEditModal={this.showEditModal}/>
                                        </div>
                                break;
                                case 'CL': 
                                    template = 
                                    <div key={i} data-grid={{ x: sumbuX, y: sumbuY, w: 3, h: 2}} >
                                            <CleanText {...e} graphId={graphId} Editable={Editable} updateData={updateData} widgetData={widgetData} showEditModal={this.showEditModal}/>
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

export default withAuth(Chart_template);