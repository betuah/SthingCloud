import React from 'react';
import { Layout } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import APPCONFIG from 'constants/appConfig';
const { Footer } = Layout;

const AppFooter = () => (
  <Footer className="app-footer app-footer-custom">
    <div className="footer-inner-v1">
      <span className="small">
      © <a className="brand link-animated-hover link-hover-v2" rel="_blank" href={'#/'}>{APPCONFIG.brand} {APPCONFIG.year}</a>   
      </span>
      <span className="small">
        version: 1.0.1 | Built with Love <SmileOutlined />
      </span>
    </div>
  </Footer>
)

export default AppFooter;
