import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router'
import loadable from 'react-loadable';
import LoadingComponent from 'components/Loading';
import { Layout } from 'antd';
const { Content } = Layout;

let Device = loadable({
  loader: () => import('routes/device/'),
  loading: LoadingComponent
})
let Dashboard = loadable({
  loader: () => import('routes/dashboard/'),
  loading: LoadingComponent
})
let Visualization = loadable({
  loader: () => import('routes/visualization/'),
  loading: LoadingComponent
})
let Controller = loadable({
  loader: () => import('routes/controller/'),
  loading: LoadingComponent
})
let Databucket = loadable({
  loader: () => import('routes/databucket/'),
  loading: LoadingComponent
})


class AppContent extends React.Component {
  render() {
    const { match } = this.props;

    return (
      <Content id='app-content'>
        <Route path={`${match.url}/dashboard`} component={Dashboard} />
        <Route path={`${match.url}/device`} component={Device} />
        <Route path={`${match.url}/visualization`} component={Visualization} />
        <Route path={`${match.url}/controller`} component={Controller} />
        <Route path={`${match.url}/databucket`} component={Databucket} />
      </Content>
    );
  }
}

export default withRouter(AppContent);
