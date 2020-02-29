import React from 'react';
import { connect } from 'react-redux';
import AppCustomizer from 'components/Customizer';
import APPCONFIG from 'constants/appConfig'; 
import { withAuth } from '../../Auth/context/AuthContext'

import App from './App'
import AppV2 from './AppV2'
import ContentOnly from './ContentOnly'
import HeaderContentFooter from './HeaderContentFooter'
import { Redirect } from 'react-router';

class AppLayout extends React.Component {

  updateLayout(layout, boxedLayout, fixedSidenav, fixedHeader) {
    switch(layout) {
      case '1':
        return <App isLoggedIn={this.props.isLoggedIn} boxedLayout={boxedLayout} fixedSidenav={fixedSidenav} fixedHeader={fixedHeader} />;
      case '2':
        return <AppV2 boxedLayout={boxedLayout} />;
      case '3':
        return <HeaderContentFooter boxedLayout={boxedLayout} fixedHeader={fixedHeader} />;
      case '4':
        return <ContentOnly boxedLayout={boxedLayout} />;
      default:
        return <App />;
    }
  }

  isShowCustomizer() {
    if (APPCONFIG.customizer) {
      return <AppCustomizer />;
    }
    return (null);
  }


  render() {
    const { isLoggedIn, layout, boxedLayout, fixedSidenav, fixedHeader } = this.props;

    return (
      <div id="app-layout-container">
        { isLoggedIn === false ? <Redirect to={'/'} /> : this.updateLayout(layout, boxedLayout, fixedSidenav, fixedHeader) }
        { this.isShowCustomizer() }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  layout: state.settings.layout,
  boxedLayout: state.settings.boxedLayout,
  fixedSidenav: state.settings.fixedSidenav,
  fixedHeader: state.settings.fixedHeader
});

export default connect(
  mapStateToProps
)(withAuth(AppLayout));

