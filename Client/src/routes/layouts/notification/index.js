import React from 'react'
import { withAuth } from 'components/Auth/context/AuthContext'
import NotifContent from './NotifContent'

const Notification = (props) => (
    <div className="app-header-notifications" >
        <NotifContent {...props}/>
    </div>
)
  
export default withAuth(Notification)