import React, { Component } from 'react'
import { Tag } from 'antd'
import { List, ListItem, Tabs, Tab, Button }  from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import MaterialIcon from 'components/MaterialIcon'
import { Modal } from 'antd'
import Moment from 'react-moment'
import 'moment-timezone'

import NotifListContent from './NotifListContent'

const BLANK = {}

const NotifAlert = (props) => {
  const notifData = props.notifList.sort((a, b) => {
    const date1 = new Date(a._dataCreatedAt)
    const date2 = new Date(b._dataCreatedAt)
    return date2 - date1;
  })

  return (
  <div>
    <List>
      {
        notifData.length < 1 ? 
          <div className="p-2 mb-2 text-center list-style-v1">
            <div className="list-item">
              <div className="list-item__body">
                <div className="list-item__datetime">Yout dont have any notification</div>
              </div>
            </div>
          </div>
        : 
        notifData.slice(0, 5).map((item, i) =>
          <ListItem button key={i} onClick={() => props.showNotif(item._id)}>
            <div className="list-style-v1">
              <div className="list-item">
                <div className="list-item__body">
                  <div className={item.read === 0 ? "list-item__title font-weight-bold" : "list-item__title"}>{item.title} 
                    <Tag color={item.status === 0 ? 'green' : 'red'}>{item.status === 1 ? 'Max Alert' : (item.status === 2 ? 'Min Alert' : 'Normal')}</Tag>
                  </div>
                  <div className="list-item__desc text-truncate">{item.message}</div>
                  <div className="list-item__datetime"><Moment tz={localStorage.getItem('timeZone')} format="D MMM YYYY (HH:mm A)">{item._dataCreatedAt}</Moment> - <Moment tz={localStorage.getItem('timeZone')} fromNow>{item._dataCreatedAt}</Moment></div>
                </div>
              </div>
            </div>
          </ListItem>
        )
      }
      {
        notifData.length > 0 && 
        <ListItem button className="ahn-footer" onClick={props.showNotifList}>
          <a href={BLANK.link} className="no-link-style">Read All <MaterialIcon icon="arrow_forward" /></a>
        </ListItem>
      }
    </List>
  </div>
)}

const NotifModal = (props) => {
  const tmpData = props.notifList.find(item => item._id === props.showNotifId)
  const notifData = tmpData ? tmpData : ''

  return (
    <Modal
        visible={props.showNotif}
        onCancel={() => props.closeModal('notif')}
        closable={true}
        footer={false}
    >
        <div className="col-md-12 mx-auto">
          <h5 style={{color: '#FF9800'}} className="text-center"><b>{notifData.title}</b></h5>
          <div className="divider divider-dotted"></div>
          <p className="text-center">{notifData.message}</p>
          <div className="divider divider-dotted"></div>
          <div className="d-flex justify-content-end"><Button key="back" color="primary" onClick={() => props.closeModal('notif')}>Close</Button></div>
        </div>
    </Modal> 
  )
}

class NotifContent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0,
      showNotifId: '',
      showNotif: false,
      showNotifList: false
    }

    this.handleChange   = this.handleChange.bind(this)
    this.showNotif      = this.showNotif.bind(this)
    this.closeModal     = this.closeModal.bind(this)
    this.showNotifList  = this.showNotifList.bind(this)
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  showNotif = id => {
    // const { server_url, axios } = this.props

    // axios.post(`${server_url}/api/user`)

    this.props.handlePopover(2)
    this.setState({
      ...this.state,
      showNotifId: id,
      showNotif: true,
      showNotifList: false
    })
  }

  showNotifList = () => {
    this.props.handlePopover()
    this.setState({
      ...this.state,
      showNotifList: true
    })
  }

  closeModal = val => {
    if (val === 'notif') {
      this.setState({
        ...this.state,
        showNotifId: '',
        showNotif: false
      })
    } else {
      this.setState({
        ...this.state,
        showNotifList: false
      })
    }
  }

  render() {
    const { value } = this.state
    const { notifList, badge } = this.props
  
    return(
      <div>
        <NotifModal {...this.state} notifList={notifList} closeModal={this.closeModal}/>
        <NotifListContent {...this.state} notifList={notifList} showNotif={this.showNotif} closeModal={this.closeModal}/>

        <Tabs 
          value={value} 
          onChange={this.handleChange} 
          className="ahn-tabs"
          variant="fullWidth"
        >
          <Tab label={<span><MaterialIcon icon="article" />{`Notification List (${badge})`}</span>} />
        </Tabs>
        <SwipeableViews
            index={value}
            onChangeIndex={this.handleChange}
        >
            <NotifAlert onChange={this.handleChange} notifList={notifList} showNotif={this.showNotif} showNotifList={this.showNotifList} />
        </SwipeableViews>
      </div>
    );
  }
}

export default NotifContent