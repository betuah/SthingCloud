import React, { Fragment } from 'react'
import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Layout, Popover } from 'antd'
import Badge from '@material-ui/core/Badge'
import Logo from 'components/Logo'
import { toggleCollapsedNav, toggleOffCanvasMobileNav } from 'actions/settingsActions'
import Notifications from 'routes/layouts/notification'
import MaterialIcon from 'components/MaterialIcon'
import { Menu, MenuItem } from '@material-ui/core'
import { BarLoader } from 'components/Loading/Loader';

import { withAuth } from 'components/Auth/context/AuthContext'

const { Header } = Layout;
const DEMO = {}
class AppHeader extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      anchorEl: null,
      badge: null,
      account: true,
      popover: false,
      notifList: [],
      signoutLoading: false
    }

    this.handleSignOut = this.handleSignOut.bind(this)
    this.getNotif      = this.getNotif.bind(this)
    this.handlePopover = this.handlePopover.bind(this)
    this.updateNotif   = this.updateNotif.bind(this)
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handlePopover = req => {
    this.setState({ popover: Number(req) === 1 ? true : (Number(req) === 2 ? false : !this.state.popover) })
  }

  handleSignOut() {
    const { signOut, setIsLoggin } = this.props
    this.setState({ signoutLoading: true })

    signOut().catch(err => {
      this.setState({ signoutLoading: false })
      setIsLoggin(false)
    })
  }

  async componentDidMount() {
    const { initSocket, socket, signOut } = this.props
    initSocket()
    await this.getNotif().catch(err => signOut())

    socket.on('notif_event', async data => {
      await this.getNotif().catch(err => signOut())
    })
  }

  updateNotif = async () => {
    await this.getNotif().catch(err => this.signOut())
  }

  getNotif = () => new Promise((resolve, reject) => {
    const { axios, server_url } = this.props

    axios.get(`${server_url}/api/user/notif`).then(res => {
        const notRead = [...res.data.data.map(item => item).filter(val => val.notif.read === 0)]

        this.setState({
          notifList: res.data.data,
          badge: notRead.length
        })

        resolve(true)
    }).catch(err => {
        reject(new Error(err))
    })
  })

  onToggleCollapsedNav = () => {
    const { handleToggleCollapsedNav, collapsedNav } = this.props;
    handleToggleCollapsedNav(!collapsedNav);
  }

  onToggleOffCanvasMobileNav = () => {
    const { handleToggleOffCanvasMobileNav, offCanvasMobileNav } = this.props;
    handleToggleOffCanvasMobileNav(!offCanvasMobileNav);
  }

  render() {
    const { headerShadow, colorOption, showLogo, server_url } = this.props;
    const { anchorEl } = this.state
    const profileData = localStorage.getItem('profileData') ? JSON.parse(localStorage.getItem('profileData')) : false

    return (
      <Fragment>
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
                <Popover visible={this.state.popover} onClick={this.handlePopover} placement="bottomRight" content={<Notifications {...this.state} handlePopover={this.handlePopover} updateNotif={this.getNotif} />} onVisibleChange={this.handlePopover} trigger="click" overlayClassName="app-header-popover">
                  <a href={DEMO.link} className="list-inline-item"><Badge className="header-badge" badgeContent={this.state.badge}><MaterialIcon icon="notifications" className="header-icon-notification" /></Badge></a>
                </Popover>
                <a className="list-inline-item" href={DEMO.link}>
                  <div 
                    className="avatar" 
                    aria-owns={anchorEl ? 'app-header-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                  >
                    <img 
                      src={profileData.photoUrl ? (profileData.photoUrl.sourceId === 'api' ? `${server_url}/public/avatars/${profileData.photoUrl.url}` : profileData.photoUrl.url) : (profileData.gender === 'male' || profileData.gender === '' ? 'assets/avatars/male-avatar.png' : 'assets/avatars/female-avatar.png')} 
                      alt="avatar" 
                      className="avatar-img" 
                    />
                    <span className="avatar-text d-none d-md-inline">{profileData.fullName ? profileData.fullName : ''}</span>
                  </div>
                  <Menu
                    id="app-header-menu"
                    className="app-header-dropdown"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.handleClose} className="d-block d-md-none"> <div>Signed in as <strong>{profileData.fullName ? profileData.fullName : ''}</strong></div> </MenuItem>
                    <div className="divider divider-solid my-1 d-block d-md-none"></div>
                    <MenuItem onClick={this.handleClose}> <Link to={'/app/user/profile'}><MaterialIcon icon="account_circle" />Account</Link> </MenuItem>
                    <MenuItem onClick={this.handleClose}> <Link to={'/app/user/settings'}><MaterialIcon icon="settings" />Settings</Link> </MenuItem>
                    <div className="divider divider-solid my-1"></div>
                    <MenuItem onClick={this.handleSignOut}> <a href={DEMO.href}><MaterialIcon icon="forward" />Sign out</a> </MenuItem>
                    { this.state.signoutLoading ? <BarLoader /> : null}
                  </Menu>
                </a>
              </div>
            </div>
          </div>
        </Header>
      </Fragment>
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
