import React from 'react';
import MaterialIcon from 'components/MaterialIcon';
import { notification } from 'antd';

const notif = (type, title, desc) => {
    let icon = null;
    switch(type) {
        case 'success':
            icon = <MaterialIcon icon="check_circle" className="text-success" />;
            break;
        case 'warning':
            icon = <MaterialIcon icon="warning" className="text-warning" />;
            break;
        case 'error':
            icon = <MaterialIcon icon="error" className="text-danger" />;
            break;
        default:
            icon = <MaterialIcon icon="info" className="text-info" />;
    }
    
    notification.open({
        message: title,
        description: desc,
        icon: icon
    });
};

export default notif;