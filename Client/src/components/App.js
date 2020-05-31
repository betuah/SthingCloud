import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withAuth } from 'components/Auth/context/AuthContext';
import loadable from 'react-loadable';
import classnames from 'classnames';
import { MuiThemeProvider } from '@material-ui/core/styles';
import LoadingComponent from 'components/Loading';
import AppLayout from 'components/Layout/AppLayout';

import lightTheme from 'constants/themes/lightTheme';
import darkTheme from 'constants/themes/darkTheme';
import grayTheme from 'constants/themes/grayTheme';

// 3rd
// import 'styles/antd.less';
import 'styles/bootstrap/bootstrap.scss'
// custom
import "styles/layout.scss"
import "styles/theme.scss"
import "styles/ui.scss"

let Auth = loadable({
  loader: () => import('./Auth'),
  loading: LoadingComponent
})

let ShareContent = loadable({
  loader: () => import('./Layout/ShareContent'),
  loading: LoadingComponent
})

let Exception = loadable({
  loader: () => import('./Layout/Exception'),
  loading: LoadingComponent
})

class App extends React.Component {

  render() {
    const { match, location, theme, isLoggedIn } = this.props
    const isRoot = location.pathname === '/' ? true : false

    if (isRoot) {
      return ( isLoggedIn ? <Redirect to={'/app/dashboard'}/> : <Redirect to={'/user/signin'}/> );
    }

    let materialUITheme;
    switch (theme) {
      case 'gray':
        materialUITheme = grayTheme;
        break;
      case 'dark':
        materialUITheme = darkTheme;
        break;
      default:
        materialUITheme = lightTheme;
    }

    return (
      <MuiThemeProvider theme={materialUITheme}>
        <div id="app" 
          className={classnames('app-main', {
            'theme-gray': theme === 'gray',
            'theme-dark': theme === 'dark'})
          }>
            <Switch>
              <Route path={`${match.url}app`} component={AppLayout} />
              <Route path={`${match.url}exception`} component={Exception} />
              <Route path={`${match.url}user/:req`} component={Auth} />
              <Route path={`${match.url}graph/:userId/:graphId`} component={ShareContent} />
              <Route path="*" component={Exception} />
            </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
});

export default connect(
  mapStateToProps
)(withAuth(App));
