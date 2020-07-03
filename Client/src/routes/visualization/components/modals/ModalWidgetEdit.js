import React, { Fragment, Component } from 'react'
import notif from 'components/NotificationPopUp/notif'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import { TextField, Button, Select, FormControl, MenuItem, InputLabel, Input, Tabs, Tab, Switch, FormControlLabel, Chip } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import {  Modal } from 'antd'

const Content = props => {
    return (
        <form className="form-v1 mt-3">
            <div className="form-group">
                <div className="input-group-v1">
                    <div className="input-group-icon">
                        <MaterialIcon icon="bubble_chart" style={{color: '#00BCD4'}} />
                    </div>
                    <TextField                                   
                        id="widget"
                        name="widgetTitle"
                        label="Widget Title"
                        type="text"
                        fullWidth
                        autoComplete="off"
                        onChange={props.onChange}
                        required
                        placeholder="Widget Title"
                        value={props.data.widgetTitle}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            <div className="form-group">
                <div className="input-group-v1">
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="resourceType">Widget data Resource</InputLabel>
                        <Select
                            value={props.data.resourceType}
                            onChange={props.onChange}
                            inputProps={{
                                name: 'resourceType',
                                    id: 'resourceType',
                                }
                            }
                            required
                        >
                            <MenuItem value={0} disabled>
                                <em>Select widget data resources</em>
                            </MenuItem>
                            {props.inputResource.map((item, i) => <MenuItem key={i} value={item.value}>{item.name}</MenuItem>)}
                        </Select>
                    </FormControl>                            
                </div>
            </div>
            <div className="form-group" style={props.data.resourceType === 0 ? { display: 'none' } : { display: 'block' }}>
                <div className="input-group-v1">                            
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="resourceId">{props.data.resourceType === 1 ? "Device List" : (props.data.resourceType === 2 ? "Data Bucket List" : "Resource")}</InputLabel>
                        <Select
                            value={props.data.resourceId}
                            onChange={props.onChange}
                            inputProps={{
                                name: 'resourceId',
                                    id: 'resourceId',
                                }
                            }
                            required                                    
                        >
                            <MenuItem value={0} disabled>
                                <em>{props.data.resourceType === 1 ? "Select your device" : (props.data.resourceType === 2 ? "Select your data bucket" : "Select your Resource")}</em>
                            </MenuItem>
                            {props.deviceList.map((item, i) => <MenuItem key={i} value={item._id}>{`${item.device} (${item._id})`}</MenuItem>)}
                        </Select>
                    </FormControl>                            
                </div>
            </div>
            <div className="form-group" style={props.data.resourceId === 0 ? { display: 'none' } : { display: 'block' }}>
                <div className="input-group-v1">                            
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="widgetChart">Widget Template</InputLabel>
                        <Select
                            value={props.data.widgetChart}
                            onChange={props.onChange}
                            inputProps={{
                                name: 'widgetChart',
                                    id: 'widgetChart',
                                }
                            }
                            required
                        >
                            <MenuItem value={0} disabled>
                                <em>Select your chart template</em>
                            </MenuItem>
                            {props.chart.map((item, i) => <MenuItem key={i} value={item.code}>{item.value}</MenuItem>)}
                        </Select>
                    </FormControl>                            
                </div>
            </div>
            <div className="form-group" style={props.data.widgetChart === 0 ? { display: 'none' } : { display: 'block' }}>
                <div className="input-group-v1">
                    <div className="input-group-icon">
                        <MaterialIcon icon="settings_ethernet" style={{color: '#00BCD4'}} />
                    </div>
                    <TextField                                   
                        id="dataId"
                        name="dataId"
                        label="Data ID"
                        type="text"
                        fullWidth
                        autoComplete="off"
                        onChange={props.onChange}
                        required
                        placeholder="Your data ID. Ex: graphData01"
                        value={props.data.dataId}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
        </form>
    )
}

const TriggerMax = props => {
    return (
        <form className="form-v1 mt-3 w-100">
            <div className="form-group">
                <div className="input-group-v1">
                    <div className="input-group-icon">
                        <MaterialIcon icon="bubble_chart" style={{color: '#00BCD4'}} />
                    </div>
                    <TextField                                   
                        id="widget"
                        name="triggerMaxVal"
                        label="Set Max value"
                        type="number"
                        fullWidth
                        autoComplete="off"
                        onChange={props.onChange}
                        required
                        placeholder="Set Max value to trigger action. Ex: 90"
                        value={props.data.triggerMaxVal}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            <div className="form-group">
                <FormControl 
                    fullWidth 
                    required
                >
                    <InputLabel shrink={true} id="demo-mutiple-chip-label">Action Turn On</InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        displayEmpty
                        inputProps={{
                            name: 'triggerMaxActionOn',
                                id: 'triggerMaxActionOn',
                            }
                        }
                        value={props.data.triggerMaxActionOn}
                        onChange={props.onChange}
                        input={<Input id="select-multiple-chip" />}
                        name="triggerMaxActionOn"
                        renderValue={selected => {
                            if (selected.length === 0) {
                                return <em>Choose one or more controller widget to turn on</em>;
                            }
                            
                            return (
                                <div className="d-flex flex-wrap">
                                    {selected.map(data => (
                                        <Chip className="m-1" key={data} label={data} />
                                    ))}
                                </div>
                            )
                        }}
                    >
                        <MenuItem disabled value=""><em><b>{props.controllerList.length < 1 ? 'There is no data available in controlller' : 'Choose one or more controller widget to turn on'}</b></em></MenuItem>
                        {props.controllerList.map((item, i) => {
                            const arr = []
                            const child = item.controller_widget

                            if (child.length > 0) {
                                arr.push(<MenuItem disabled><em>{item.controller}</em></MenuItem>)
                                for (let j = 0; j < child.length; j++) {
                                    const isIndex = props.data.triggerMaxActionOff.findIndex(e => e && (e === `${item._id}.${child[j]._id}`))

                                    if (isIndex === -1) {
                                        arr.push(
                                            <MenuItem 
                                                key={child[j]._id+i} 
                                                value={`${item._id}.${child[j]._id}`}
                                            >
                                                {child[j].widgetTitle}
                                            </MenuItem>)
                                    }
                                }
                            }
                            return arr
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className="form-group">
                <FormControl 
                    fullWidth 
                    required
                >
                    <InputLabel shrink={true} id="demo-mutiple-chip-label">Action Turn Off</InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        displayEmpty
                        inputProps={{
                            name: 'triggerMaxActionOff',
                                id: 'triggerMaxActionOff',
                            }
                        }
                        value={props.data.triggerMaxActionOff}
                        onChange={props.onChange}
                        input={<Input id="select-multiple-chip" />}
                        name="triggerMaxActionOff"
                        renderValue={selected => {
                            if (selected.length === 0) {
                                return <em>Choose one or more controller widget to turn off</em>;
                            }
                            
                            return (
                                <div className="d-flex flex-wrap">
                                    {selected.map(data => (
                                        <Chip className="m-1" key={data} label={data} />
                                    ))}
                                </div>
                            )
                        }}
                    >
                        <MenuItem disabled value=""><em><b>{props.controllerList.length < 1 ? 'There is no data available in controlller' : 'Choose one or more controller widget to turn off'}</b></em></MenuItem>
                        {props.controllerList.map((item, i) => {
                            const arr = []
                            const child = item.controller_widget

                            if (child.length > 0) {
                                arr.push(<MenuItem disabled><em>{item.controller}</em></MenuItem>)
                                for (let j = 0; j < child.length; j++) {
                                    const isIndex = props.data.triggerMaxActionOn.findIndex(e => e && (e === `${item._id}.${child[j]._id}`))

                                    if (isIndex === -1) {
                                        arr.push(
                                            <MenuItem 
                                                key={child[j]._id+i} 
                                                value={`${item._id}.${child[j]._id}`}
                                            >
                                                {child[j].widgetTitle}
                                            </MenuItem>)
                                    }
                                }
                            }
                            return arr
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className="form-group ml-3">
                <FormControlLabel
                    control={
                        <Switch
                            checked={Number(props.data.triggerMaxActive) === 1 ? true : false}
                            onChange={props.onChange}
                            value={Number(props.data.triggerMaxActive) === 1 ? 0 : 1}
                            color="primary"
                            name='triggerMaxActive'
                        />
                    }
                    label="Activate Max Action"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={Number(props.data.notifMax) === 1 ? true : false}
                            onChange={props.onChange}
                            value={Number(props.data.notifMax) === 1 ? 0 : 1}
                            color="primary"
                            name='notifMax'
                        />
                    }
                    label="Notif Me"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={Number(props.data.sendMailMax) === '1' ? true : false}
                            onChange={props.onChange}
                            value={Number(props.data.sendMailMax) === '1' ? '0' : '1'}
                            color="primary"
                            name='sendMailMax'
                        />
                    }
                    label="Send Mail"
                />
            </div>
            <div className="form-group" style={Number(props.data.sendMailMax) === 0 ? { display: 'none' } : { display: 'block' }}>
                <div className="input-group-v1">
                    <div className="input-group-icon">
                        <MaterialIcon icon="email" style={{color: '#00BCD4'}} />
                    </div>
                    <TextField                                   
                        id="mailListMax"
                        name="mailListMax"
                        label="Send Mail to"
                        type="text"
                        fullWidth
                        autoComplete="off"
                        onChange={props.onChange}
                        placeholder="Ex: sthing@gmail.com,mail@seamolec.org"
                        value={props.data.mailListMax}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
        </form>
    )
}

const TriggerMin = props => {
    return (
        <form className="form-v1 mt-3 w-100">
            <div className="form-group">
                <div className="input-group-v1">
                    <div className="input-group-icon">
                        <MaterialIcon icon="bubble_chart" style={{color: '#00BCD4'}} />
                    </div>
                    <TextField                                   
                        id="widget"
                        name="triggerMinVal"
                        label="Set Min value"
                        type="number"
                        fullWidth
                        autoComplete="off"
                        onChange={props.onChange}
                        required
                        placeholder="Set Min value to trigger action. Ex 10"
                        value={props.data.triggerMinVal}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            <div className="form-group">
                <FormControl 
                    fullWidth 
                    required
                >
                    <InputLabel shrink={true} id="demo-mutiple-chip-label">Action Turn On</InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        displayEmpty
                        inputProps={{
                            name: 'triggerMinActionOn',
                                id: 'triggerMinActionOn',
                            }
                        }
                        value={props.data.triggerMinActionOn}
                        onChange={props.onChange}
                        input={<Input id="select-multiple-chip" />}
                        name="triggerMinActionOn"
                        renderValue={selected => {
                            if (selected.length === 0) {
                                return <em>Choose one or more controller widget to turn on</em>;
                            }
                            
                            return (
                                <div className="d-flex flex-wrap">
                                    {selected.map(data => (
                                        <Chip className="m-1" key={data} label={data} />
                                    ))}
                                </div>
                            )
                        }}
                    >
                        <MenuItem disabled value=""><em><b>{props.controllerList.length < 1 ? 'There is no data available in controlller' : 'Choose one or more controller widget to turn on'}</b></em></MenuItem>
                        {props.controllerList.map((item, i) => {
                            const arr = []
                            const child = item.controller_widget

                            if (child.length > 0) {
                                arr.push(<MenuItem disabled><em>{item.controller}</em></MenuItem>)
                                for (let j = 0; j < child.length; j++) {
                                    const isIndex = props.data.triggerMinActionOff.findIndex(e => e && (e === `${item._id}.${child[j]._id}`))

                                    if (isIndex === -1) {
                                        arr.push(
                                            <MenuItem 
                                                key={child[j]._id+i} 
                                                value={`${item._id}.${child[j]._id}`}
                                            >
                                                {child[j].widgetTitle}
                                            </MenuItem>)
                                    }
                                }
                            }
                            return arr
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className="form-group">
                <FormControl 
                    fullWidth 
                    required
                >
                    <InputLabel shrink={true} id="demo-mutiple-chip-label">Action Turn Off</InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        displayEmpty
                        inputProps={{
                            name: 'triggerMinActionOff',
                                id: 'triggerMinActionOff',
                            }
                        }
                        value={props.data.triggerMinActionOff}
                        onChange={props.onChange}
                        input={<Input id="select-multiple-chip" />}
                        name="triggerMinActionOff"
                        renderValue={selected => {
                            if (selected.length === 0) {
                                return <em>Choose one or more controller widget to turn off</em>;
                            }
                            
                            return (
                                <div className="d-flex flex-wrap">
                                    {selected.map(data => (
                                        <Chip className="m-1" key={data} label={data} />
                                    ))}
                                </div>
                            )
                        }}
                    >
                        <MenuItem disabled value=""><em><b>{props.controllerList.length < 1 ? 'There is no data available in controlller' : 'Choose one or more controller widget to turn off'}</b></em></MenuItem>
                        {props.controllerList.map((item, i) => {
                            const arr = []
                            const child = item.controller_widget

                            if (child.length > 0) {
                                arr.push(<MenuItem disabled><em>{item.controller}</em></MenuItem>)
                                for (let j = 0; j < child.length; j++) {
                                    const isIndex = props.data.triggerMinActionOn.findIndex(e => e && (e === `${item._id}.${child[j]._id}`))

                                    if (isIndex === -1) {
                                        arr.push(
                                            <MenuItem 
                                                key={child[j]._id+i} 
                                                value={`${item._id}.${child[j]._id}`}
                                            >
                                                {child[j].widgetTitle}
                                            </MenuItem>)
                                    }
                                }
                            }
                            return arr
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className="form-group ml-3">
                <FormControlLabel
                    control={
                        <Switch
                            checked={Number(props.data.triggerMinActive) === 1 ? true : false}
                            onChange={props.onChange}
                            value={Number(props.data.triggerMinActive) === 1 ? 0 : 1}
                            color="primary"
                            name='triggerMinActive'
                        />
                    }
                    label="Activate Min Action"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={Number(props.data.notifMin) === 1 ? true : false}
                            onChange={props.onChange}
                            value={Number(props.data.notifMin) === 1 ? 0 : 1}
                            color="primary"
                            name='notifMin'
                        />
                    }
                    label="Notif Me"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={Number(props.data.sendMailMin) === 1 ? true : false}
                            onChange={props.onChange}
                            value={Number(props.data.sendMailMin) === 1 ? 0 : 1}
                            color="primary"
                            name='sendMailMin'
                        />
                    }
                    label="Mail Me"
                />
            </div>
            <div className="form-group" style={Number(props.data.sendMailMin) === 0 ? { display: 'none' } : { display: 'block' }}>
                <div className="input-group-v1">
                    <div className="input-group-icon">
                        <MaterialIcon icon="email" style={{color: '#00BCD4'}} />
                    </div>
                    <TextField                                   
                        id="mailListMin"
                        name="mailListMin"
                        label="Send Mail to"
                        type="text"
                        fullWidth
                        autoComplete="off"
                        onChange={props.onChange}
                        placeholder="Ex: sthing@gmail.com,mail@seamolec.org"
                        value={props.data.mailListMin}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
        </form>
    )
}

class ModalEditWidget extends Component {
    constructor(props) {
        super(props)
        
        this._isMounted = false;

        this.state = {
            tabIndexValues: 0,
            data: {
                widgetTitle: '',
                resourceType: 0,
                resourceId: 0,
                widgetChart: 0,
                dataId: '',
                dataValue: '',
                notifMax: 0,
                sendMailMax: 0,
                mailListMax: '',
                triggerMaxActive: 0,
                triggerMaxVal: '',
                triggerMaxActionOn: [],
                triggerMaxActionOff: [],
                notifMin: 0,
                sendMailMin: 0,
                mailListMin: '',
                triggerMinActive: 0,
                triggerMinVal: '',
                triggerMinActionOn: [],
                triggerMinActionOff: []
            },
            chart: [
                { code: 'T', value: 'Tachometer' },
                { code: 'DC', value: 'Doughnut' },
                { code: 'G', value: 'Gauge' },
                { code: 'PB', value: 'Progressbar' },
                { code: 'CL', value: 'Clean Text'}
            ],
            inputResource: [
                { value: 'DEVICE', name: 'From Device' }, 
                // { value: 'BUCKET', name: 'From Data Bucket' }
            ],
            deviceList: [],
            bucketList: [],
            controllerList: []
        }

        this.clearState     = this.clearState.bind(this)
        this.handleChange   = this.handleChange.bind(this)
        this.updateState    = this.updateState.bind(this)
        this.handleChangeTabs   = this.handleChangeTabs.bind(this)
        this.handleChangeIndex  = this.handleChangeIndex.bind(this)
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentDidMount() {
        const { axios, server_url } = this.props
        const data = this.updateState()

        axios.get(`${server_url}/api/controller`)
        .then((res) => {
            this.setState({
                controllerList: [...res.data]
            })
        })

        if (data.resourceType === 'DEVICE') {
            const { server_url, axios } = this.props; 

            axios.get(`${server_url}/api/device`)
            .then((res) => {                
                this._isMounted && this.setState({
                    data: {
                        ...data
                    },
                    deviceList: [...res.data]
                })
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateState() {
        const { widgetData, widgetId } = this.props

        let data = {}

        widgetData.filter(n => n._id === widgetId).map(n => 
            data = {
                widgetTitle: n.widgetTitle,
                resourceType: n.resourceType,
                resourceId: n.resourceId,
                widgetChart: n.widgetChart,
                dataId: n.dataId,
                dataValue: n.dataValue,
                notifMax: n.settings.triggerMax.notif,
                sendMailMax: n.settings.triggerMax.mail,
                mailListMax: n.settings.triggerMax.mailList,
                triggerMaxActive: n.settings.triggerMax.active,
                triggerMaxVal: n.settings.triggerMax.value,
                triggerMaxActionOn: [...n.settings.triggerMax.actionOn],
                triggerMaxActionOff: [...n.settings.triggerMax.actionOff],
                notifMin: n.settings.triggerMin.notif,
                sendMailMin: n.settings.triggerMin.mail,
                mailListMin: n.settings.triggerMin.mailList,
                triggerMinActive: n.settings.triggerMin.active,
                triggerMinVal: n.settings.triggerMin.value,
                triggerMinActionOn: [...n.settings.triggerMin.actionOn],
                triggerMinActionOff: [...n.settings.triggerMin.actionOff]
            }
        )

        return data;
    }

    handleChange = (e, val) => {
        const { name, value } = e.target

        if(val) {
            if (name === 'triggerMaxActionOn' || name === 'triggerMaxActionOff' || name === 'triggerMinActionOn' || name === 'triggerMinActionOff') {
                this._isMounted && this.setState({
                    data: {
                        ...this.state.data,
                        [name]: [...value]
                    }
                })
            } else {
                this._isMounted && this.setState({
                    data: {
                        ...this.state.data,
                        [name]: value
                    }
                })
            }      
        } else {
            this._isMounted && this.setState({
                data: {
                    ...this.state.data,
                    [name]: value
                }
            })

            if (name === 'resourceType' && value === 'DEVICE') {
                const { server_url, axios } = this.props; 
    
                this._isMounted && axios.get(`${server_url}/api/device`)
                .then((res) => {
                    this.setState({
                        deviceList: [...res.data]
                    })
                })
            }
        }
    }

    handleChangeTabs = (event, tabIndexValues) => {
        this._isMounted && this.setState({ tabIndexValues })
    }
    
    handleChangeIndex = index => {
        this._isMounted && this.setState({ tabIndexValues: index })
    }

    handleOk = () => {
        const { server_url, axios, graphId, widgetId } = this.props
        const { widgetTitle, resourceType, resourceId, widgetChart, dataId } = this.state.data 

        if (widgetTitle === '' || resourceType === 0 || resourceId === 0 || widgetChart === 0 || dataId === '') {
            notif('warning', 'Warning' , 'Please fill all required fields!')
            console.log('tes')
        } else {
            axios.put(`${server_url}/api/graph/widget/${graphId}/${widgetId}`, this.state.data)
            .then(res => {
                notif('success', res.data.status , 'Success Update Widget.')
                this.clearState()
            })
            .catch(err => {
                if(err.response) {
                    const error = err.response.data;       
                    notif(error.code === 11000 ? 'error' : 'warning', error.code === 11000 ? 'Error' : 'Warning', error.msg)
                } else {               
                    const resMsg = { status: 'Error', code: 500, msg: 'Internal Server Error'}         
                    notif('error', resMsg.status, resMsg.msg)
                }
            });
        }       
    }

    clearState() {
        const { closeWidgetModal, updateData } = this.props

        updateData()

        this._isMounted && this.setState({
            data: {
                widgetTitle: '',
                resourceType: 0,
                resourceId: 0,
                widgetChart: 0,
                dataId: '',
                dataValue: '',
                notifMax: '0',
                sendMailMax: '0',
                mailListMax: '',
                triggerMaxVal: '',
                triggerMaxActionOn: [],
                triggerMaxActionOff: [],
                notifMin: '0',
                sendMailMin: '0',
                mailListMin: '',
                triggerMinVal: '',
                triggerMinActionOn: [],
                triggerMinActionOff: []
            },
            deviceList: [],
            bucketList: [],
            controllerList: []
        })

        closeWidgetModal()
    }

    render() {
        const { tabIndexValues } = this.state

        return (
            <Fragment>
                <Modal
                    visible={this.props.ModalEditWidget}
                    onOk={this.handleOk}
                    onCancel={this.clearState}
                    closable={false}
                    footer={[
                        <Button key="back" color="primary" onClick={this.clearState}>Cancel</Button>,
                        <Button key="submit" variant="contained" color="primary" onClick={this.handleOk}> Update </Button>,
                    ]}
                >
                    <div className="col-md-12">
                        <h4 style={{color: '#00BCD4'}} className="text-center">Edit <b>Widget</b></h4>
                        <div className="divider divider-dotted"></div>  
                        <Tabs value={tabIndexValues} onChange={this.handleChangeTabs} variant="fullWidth">
                            <Tab label="Widget" />
                            <Tab label="Action Max" />
                            <Tab label="Action Min" />
                        </Tabs>
                        <SwipeableViews
                            index={tabIndexValues}
                            onChangeIndex={this.handleChangeIndex}
                        >
                            <Content onChange={this.handleChange} {...this.state} />
                            <TriggerMax onChange={this.handleChange} {...this.state} />
                            <TriggerMin onChange={this.handleChange} {...this.state} />
                        </SwipeableViews> 
                        <div className="divider divider-dotted"></div>
                    </div>
                    
                </Modal> 
            </Fragment>
        )
    }
}

export default withAuth(ModalEditWidget)