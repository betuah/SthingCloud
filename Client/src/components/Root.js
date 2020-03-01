import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { AuthContextProvider } from './Auth/context/AuthContext'
import { Route } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import App from './App'; 

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ScrollToTop>
            <AuthContextProvider {...this.props}>  
              <Route path="/" component={App} />   
            </AuthContextProvider>            
          </ScrollToTop>
        </ConnectedRouter>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
