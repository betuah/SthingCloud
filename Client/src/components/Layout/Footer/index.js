import React from 'react';
import { Layout } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import APPCONFIG from 'constants/appConfig';
const { Footer } = Layout;

const AppFooter = () => (
  <Footer className="app-footer app-footer-custom">
    <div className="footer-inner-v1">
      <span className="small">
      © {APPCONFIG.year} <a className="brand link-animated-hover link-hover-v2 text-primary" rel="_blank" href={'#/'}>{APPCONFIG.brand}</a> All Rights Reserved.
      </span>
      <span className="small">
        Version: STHING 1.0 | Built with Love <SmileOutlined />
      </span>
    </div>
  </Footer>
)

export default AppFooter;
