import React from 'react';
import { Layout, Icon } from 'antd';
import APPCONFIG from 'constants/appConfig';
const { Footer } = Layout;

const AppFooter = () => (
  <Footer className="app-footer app-footer-custom">
    <div className="footer-inner-v1">
      <span className="small">
      <a className="brand link-animated-hover link-hover-v2" target="_blank" href={'#/'}>{APPCONFIG.brand}</a> © {APPCONFIG.year} 
      </span>
      <span className="small">
        version: 1.0.1 | Built with Love <Icon type="heart-o" />
      </span>
    </div>
  </Footer>
)

export default AppFooter;
