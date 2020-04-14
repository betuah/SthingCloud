import React from 'react';
import MaterialIcon from 'components/MaterialIcon';
import Button from '@material-ui/core/Button';
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

export const deleteConfirm = (callback) => {
    const key = `open${Date.now()}`;
    const btnCencel = function () {
        notification.close(key);
        callback(false)
    };
    const btnConfirm = function () {
        notification.destroy()
        callback(true)
    };
    const btn = (
        <div>
        <Button color="primary" onClick={btnCencel}>
            Cencel
        </Button>
        <Button color="default" onClick={btnConfirm}>
            Confirm
        </Button>
        </div>
    );
    notification.open({
        message: 'Delete confirmation!',
        description: 'Are you sure to delete this data ?',
        icon: <MaterialIcon icon="error" className="text-danger" />,
        btn,
        key
    });
};

export default notif;