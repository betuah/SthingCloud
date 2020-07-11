import React, { Component, Fragment } from 'react'
import InfiniteScroll from "react-infinite-scroll-component"
import { List, ListItem, ListSubheader, Tooltip, Checkbox }  from '@material-ui/core'
import MaterialIcon from 'components/MaterialIcon'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PulseLoader from "react-spinners/PulseLoader"
import { Tag } from 'antd'
import { Modal } from 'antd'
import Moment from 'react-moment'

import 'react-perfect-scrollbar/dist/css/styles.css'
import 'moment-timezone'

const BLANK = {}

const Loading = () => (
    <PulseLoader 
        size={15}
        color={"#4DD0E1"}
        loading={true}
    />
)

class NotifListContent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hasMore: true,
            items: [],
            checked: [],
        }

        this.getData             = this.getData.bind(this)
        this.fetchMoreData       = this.fetchMoreData.bind(this)
        this.closeModalNotifList = this.closeModalNotifList.bind(this)
        this.selectAll           = this.selectAll.bind(this)
        this.readNotif           = this.readNotif.bind(this)
        this.deleteNotif         = this.deleteNotif.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData () {
        const { notifList } = this.props

        const notifData = notifList.sort((a, b) => {
            const date1 = (new Date(a._dataCreatedAt))
            const date2 = (new Date(b._dataCreatedAt))
            return date2 - date1;
        })

        this.setState({
            items: [...notifData.slice(0, 6)],
            hasMore: true,
            checked: [],
        })
    }

    fetchMoreData () {
        const { notifList } = this.props
        const notifData = notifList.sort((a, b) => {
            const date1 = new Date(a._dataCreatedAt)
            const date2 = new Date(b._dataCreatedAt)
            return date2 - date1;
        })

        if (this.state.items.length >= notifList.length) {
          this.setState({ hasMore: false })
          return;
        }

        setTimeout(() => {
            
            this.setState({
                items: notifData.slice(0, this.state.items.length + 3)
            })
        }, 500)
    }

    handleToggle = value => () => {
        const {
            checked
        } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    }

    selectAll() {
        if (this.state.checked.length === this.state.items.length) {
            this.setState({
                checked: []
            })
        } else {
            const selected = this.state.items.map(item => item._id)
    
            this.setState({
                checked: selected
            })
        }
    }

    readNotif() {
        alert(JSON.stringify(this.state.checked))
    }

    deleteNotif() {
        alert(JSON.stringify(this.state.checked))
    }

    closeModalNotifList() {
        this.props.closeModal()
        this.getData()
    }

    render() {
        const { showNotif, showNotifList } = this.props
        const { items } = this.state

        return(
            <Fragment>
                <Modal
                    visible={showNotifList}
                    onCancel={this.closeModalNotifList}
                    width={900}
                    closable={true}
                    footer={false}
                    bodyStyle={{height: "550px"}}
                >
                    <PerfectScrollbar id="scrollableDiv">
                        <List subheader={<li />}>
                            <ListSubheader style={{backgroundColor: "#ffffff"}} >
                                <div className="row pt-2">
                                    <div className="col-2 col-md-1">
                                        <Checkbox
                                            checked={this.state.checked.length >= this.state.items.length}
                                            tabIndex={-1}
                                            onClick={this.selectAll}
                                            disableRipple
                                        />
                                    </div>
                                    <div className="col-7 col-md-9 d-flex justify-content-center">
                                        <p style={{fontSize: "20px", color: "0F0F0F"}} className="font-weight-bold">Notification List</p>
                                    </div>
                                    <div className="col-3 col-md-2 d-flex justify-content-center">
                                        <Tooltip title="Mark As Read" className={this.state.checked.length <= 0 && 'd-none'}>
                                            <a href={BLANK.link} className="pl-2 pr-2" onClick={this.readNotif}>
                                                <MaterialIcon icon="done_all" style={{fontSize: "22px", color: '#8BC34A'}}></MaterialIcon>
                                            </a>
                                        </Tooltip>
                                        <Tooltip title="Delete Notificatin" className={this.state.checked.length <= 0 && 'd-none'}>
                                            <a href={BLANK.link} className="pl-2 pr-2" onClick={this.deleteNotif}>
                                                <MaterialIcon icon="delete" style={{fontSize: "22px", color: '#F44336'}}></MaterialIcon>
                                            </a>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className="col-12 divider divider-dotted"></div>
                            </ListSubheader>
                            <InfiniteScroll
                                dataLength={items.length} //This is important field to render the next data
                                next={this.fetchMoreData}
                                hasMore={this.state.hasMore}
                                loader={<center><Loading /></center>}
                                endMessage={false}
                                scrollableTarget="scrollableDiv"
                            >
                            {
                                items.map((item, i) => 
                                    <ListItem button key={i} onClick={this.handleToggle(item._id)} >
                                        <div className="row w-100">
                                        <div className="col-2 col-md-1">
                                            <Checkbox
                                                checked={this.state.checked.indexOf(item._id) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </div>
                                        <div className="col-10 col-md-11 list-style-v1">
                                            <div className="list-item">
                                            <div className="list-item__body">
                                                <div className={item.read === 0 ? "list-item__title font-weight-bold" : "list-item__title"}>{item.title} 
                                                    <Tag color={item.status === 0 ? 'green' : 'red'}>{item.status === 1 ? 'Max Alert' : (item.status === 2 ? 'Min Alert' : 'Normal')}</Tag>
                                                </div>
                                                <div className="list-item__desc">{item.message}</div>
                                                <div className="list-item__datetime"><Moment tz={localStorage.getItem('timeZone')} format="D MMM YYYY (HH:mm A)">{item._dataCreatedAt}</Moment> - <Moment tz={localStorage.getItem('timeZone')} fromNow>{item._dataCreatedAt}</Moment></div>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </ListItem>
                                )
                            }
                            </InfiniteScroll>
                        </List>
                    </PerfectScrollbar>
                </Modal>
            </Fragment>
        )
    }
}

export default NotifListContent