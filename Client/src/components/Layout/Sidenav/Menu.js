import React from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import APPCONFIG from 'constants/appConfig';
import { toggleOffCanvasMobileNav } from 'actions/settingsActions';
import { USER, RESOURCES } from 'constants/uiComponents';
import Button from '@material-ui/core/Button';
import MaterialIcon from 'components/MaterialIcon';

const SubMenu = Menu.SubMenu;

class AppMenu extends React.Component {

  // list for AccordionNav
  rootMenuItemKeys= [ // without submenu
    '/app/dashboard',
    '/app/device',
    '/app/visualization',
    '/app/controller',
    '/app/databucket'
  ]
  rootSubmenuKeys = [
    '/user',
    '/resources'
  ];

  state = {
    openKeys: ['/app/dashboard'],
  };

  onOpenChange = (openKeys) => {
    // AccordionNav
    // console.log(openKeys)
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  onMenuItemClick = (item) => {
    // AccordionNav
    const itemKey = item.key;
    if(this.rootMenuItemKeys.indexOf(itemKey) >= 0) {
      this.setState({ openKeys: [itemKey] });
    }

    // 
    const { isMobileNav } = this.props;
    if (isMobileNav) {
      this.closeMobileSidenav();
    }
  }

  closeMobileSidenav = () => {
    if (APPCONFIG.AutoCloseMobileNav) {
      const { handleToggleOffCanvasMobileNav } = this.props;
      handleToggleOffCanvasMobileNav(true);
    }
  }

  // 
  getSubMenuOrItem = item => {    
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // hide submenu if there's no children items
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={<Button className="nav-item">{item.name}</Button>}
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return <Menu.Item key={item.path}><Button className="nav-item" href={item.link ? item.link : `#${item.path}`} target={item.link ? '_blank' : false}><MaterialIcon icon="arrow_right" style={{color: '#00C853'}} /><span>{item.menuName || item.name}</span></Button></Menu.Item>;
    }
  };

  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }    
    return menusData
      .filter(item => !item.hideInMenu)
      .map(item => {
        // make dom        
        const ItemDom = this.getSubMenuOrItem(item);
        return ItemDom;
      })
      .filter(item => item);
  }


  render() {
    const { collapsedNav, colorOption, location } = this.props;
    // const mode = collapsedNav ? 'vertical' : 'inline';
    const menuTheme = ['31', '32', '33', '34', '35', '36'].indexOf(colorOption) >= 0 ? 'light' : 'dark';
    const currentPathname = location.pathname;

    const menuProps = collapsedNav
      ? {}
      : {
          openKeys: this.state.openKeys
        };

    return (
      <Menu
        className="app-menu"
        theme={menuTheme}
        mode="inline"
        // inlineCollapsed={collapsedNav}
        {...menuProps}
        onOpenChange={this.onOpenChange}
        onClick={this.onMenuItemClick}
        selectedKeys={[currentPathname]}
      >
        <Menu.Item key="/app/dashboard">
          <Button className="nav-item" href="#/app/dashboard">
            <MaterialIcon icon="dashboard" style={{color: '#4CAF50'}} />
            <span className="nav-text">Dashboard</span>
          </Button>
        </Menu.Item>
        <Menu.Item key="/app/device">
          <Button className="nav-item" href="#/app/device">
            <MaterialIcon icon="developer_board" style={{color: '#2196F3'}} />
            <span className="nav-text">Device</span>
          </Button>
        </Menu.Item>
        <Menu.Item key="/app/visualization">
          <Button className="nav-item" href="#/app/visualization">
            <MaterialIcon icon="timeline" style={{color: '#FF9800'}} />
            <span className="nav-text">Data Visualization</span>
          </Button>
        </Menu.Item>
        <Menu.Item key="/app/controller">
          <Button className="nav-item" href="#/app/controller">
            <MaterialIcon icon="tune" style={{color: '#FF5722'}} />
            <span className="nav-text">Controller</span>
          </Button>
        </Menu.Item>
        <Menu.Item className="d-none" key="/app/databucket">
          <Button className="nav-item" href="#/app/databucket">
            <MaterialIcon icon="storage" style={{color: '#9C27B0'}} />
            <span className="nav-text">Data Bucket</span>
          </Button>
        </Menu.Item>
        <Menu.Divider />
        <SubMenu
          key="/user"
          title={<Button className="nav-item"><MaterialIcon icon="person_outline" style={{color: '#00E5FF'}} /><span className="nav-text">Account</span></Button>}
        >
          { this.getNavMenuItems(USER) }
        </SubMenu>
        <Menu.Divider />
        <SubMenu
          key="/resources"
          title={<Button className="nav-item"><MaterialIcon icon="layers" style={{color: '#FFEB3B'}} /><span className="nav-text">Resources</span></Button>}
        >
          { this.getNavMenuItems(RESOURCES) }
        </SubMenu>
      </Menu>
    )
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return ({
    collapsedNav: state.settings.collapsedNav,
    colorOption: state.settings.colorOption,
    location: state.routing.location
  })
};

const mapDispatchToProps = dispatch => ({
  handleToggleOffCanvasMobileNav: (isOffCanvasMobileNav) => {
    dispatch( toggleOffCanvasMobileNav(isOffCanvasMobileNav) );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppMenu);
