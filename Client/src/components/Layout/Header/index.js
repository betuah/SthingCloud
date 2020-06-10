import React from 'react'
import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import classnames from 'classnames'
import DEMO from 'constants/demoData'
import { Layout, Popover } from 'antd'
import Badge from '@material-ui/core/Badge'
import Logo from 'components/Logo'
import { toggleCollapsedNav, toggleOffCanvasMobileNav } from 'actions/settingsActions'
import Notifications from 'routes/layout/routes/header/components/Notifications'
import MaterialIcon from 'components/MaterialIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import notif from 'components/NotificationPopUp/notif'

import { withAuth } from '../../Auth/context/AuthContext'

const { Header } = Layout;

class AppHeader extends React.Component {
  constructor(props) {
    super(props) 
    this._isMounted = true
    this.state = {
      anchorEl: null,
      profileData: JSON.parse(localStorage.getItem('profileData')) ? JSON.parse(localStorage.getItem('profileData')) : false,
      badge: 5,
      account: true,
    }

    this.handleSignOut = this.handleSignOut.bind(this)
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  handleSignOut() {
    const { signOut } = this.props

    signOut()
  }

  componentDidMount() {
    const { initUser, socket } = this.props

    initUser();

    socket.on('event', data => {
      this._isMounted && data.statusChange === 1 ? notif('info', 'New Device Connected!', `${data.device} is connected!`) : notif('error', 'New Device Disconnected!', `${data.device} is disconnected!`)
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onToggleCollapsedNav = () => {
    const { handleToggleCollapsedNav, collapsedNav } = this.props;
    handleToggleCollapsedNav(!collapsedNav);
  }

  onToggleOffCanvasMobileNav = () => {
    const { handleToggleOffCanvasMobileNav, offCanvasMobileNav } = this.props;
    handleToggleOffCanvasMobileNav(!offCanvasMobileNav);
  }

  render() {
    const { headerShadow, colorOption, showLogo } = this.props;
    const { anchorEl, profileData } = this.state

    return (
      <Header className={classnames('app-header', {
        'header-elevation': headerShadow,
      })}>
        <div 
          className={classnames('app-header-inner', {
            'bg-white': ['11','12','13','14','15','16','21'].indexOf(colorOption) >= 0,
            'bg-dark': colorOption === '31',
            'bg-primary': ['22','32'].indexOf(colorOption) >= 0,
            'bg-success': ['23','33'].indexOf(colorOption) >= 0,
            'bg-info': ['24','34'].indexOf(colorOption) >= 0,
            'bg-warning': ['25','35'].indexOf(colorOption) >= 0,
            'bg-danger': ['26','36'].indexOf(colorOption) >= 0 })}
        >
          <div className="header-left">
            <div className="list-unstyled list-inline">
              {showLogo && [
                <Logo key="logo" />,
                <div key="divider" className="divider-vertical"></div>
              ]}
              <a href={DEMO.link} className="list-inline-item d-none d-md-inline-block" onClick={this.onToggleCollapsedNav}>
                <MaterialIcon icon="menu" className="list-icon" />
              </a>
              <a href={DEMO.link} className="list-inline-item d-md-none" onClick={this.onToggleOffCanvasMobileNav}>
                <MaterialIcon icon="menu" className="list-icon" />
              </a>
            </div>
          </div>

          <div className="header-right">
            <div className="list-unstyled list-inline">              
              <Popover placement="bottomRight" content={<Notifications />} trigger="click" overlayClassName="app-header-popover">
                <a href={DEMO.link} className="list-inline-item"><Badge className="header-badge" badgeContent={this.state.badge}><MaterialIcon icon="notifications" className="header-icon-notification" /></Badge></a>
              </Popover>
              <a className="list-inline-item" href={DEMO.link}>
                <div 
                  className="avatar" 
                  aria-owns={anchorEl ? 'app-header-menu' : null}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <img src={profileData.photoUrl ? profileData.photoUrl : "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"} alt="avatar" className="avatar-img" />
                  <span className="avatar-text d-none d-md-inline">{this.state.profileData.fullName ? this.state.profileData.fullName : ''}</span>
                </div>
                <Menu
                  id="app-header-menu"
                  className="app-header-dropdown"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose} className="d-block d-md-none"> <div>Signed in as <strong>{this.state.profileData.fullName ? this.state.profileData.fullName : ''}</strong></div> </MenuItem>
                  <div className="divider divider-solid my-1 d-block d-md-none"></div>
                  <MenuItem onClick={this.handleClose}> <Link to={'/app/user/profile'}><MaterialIcon icon="account_circle" />Account</Link> </MenuItem>
                  <MenuItem onClick={this.handleClose}> <Link to={'/app/user/settings'}><MaterialIcon icon="settings" />Settings</Link> </MenuItem>
                  <div className="divider divider-solid my-1"></div>
                  <MenuItem onClick={this.handleSignOut}> <Link to={'/'}><MaterialIcon icon="forward" />Sign out</Link> </MenuItem>
                </Menu>
              </a>
            </div>
          </div>
        </div>
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  offCanvasMobileNav: state.settings.offCanvasMobileNav,
  collapsedNav: state.settings.collapsedNav,
  headerShadow: state.settings.headerShadow,
  colorOption: state.settings.colorOption,
});

const mapDispatchToProps = dispatch => ({
  handleToggleCollapsedNav: (isCollapsedNav) => {
    dispatch( toggleCollapsedNav(isCollapsedNav) );
  },
  handleToggleOffCanvasMobileNav: (isOffCanvasMobileNav) => {
    dispatch( toggleOffCanvasMobileNav(isOffCanvasMobileNav) );
  }
});

// export withAuth (AppHeader)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(AppHeader));
