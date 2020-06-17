import React from 'react'
import { Upload } from 'antd'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import notif from 'components/NotificationPopUp/notif'

const Dragger = Upload.Dragger

const UploadPhoto = props => {
    const { axios, server_url } = props

    const customDraggerProps = {
        name: 'file',
        multiple: false,
        action: `${server_url}/api/user/avatar/upload`,
        customRequest: (options) => {
            const data= new FormData()
            data.append('file', options.file)
            const config= {
                "headers": {
                    "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s'
                }
            }
            axios.post(options.action, data, config).then(res => {
                options.onSuccess(res.data.url, options.file)
            }).catch((err: Error) => {
                console.log(err)
            })
            
        },
        onChange(info) {
            const status = info.file.status
            if (status === 'done') {
                notif('success', 'Upload Finish!' , 'Uploaded photo picture successfully.')
            } else if (status === 'error') {
                notif('error', 'Upload Failed!' , 'Uploaded photo picture failed.')
            }
        },
    }

    return(
        <div className="h-50">
            <Dragger {...customDraggerProps}>
                <p className="ant-upload-drag-icon">
                    <MaterialIcon icon="inbox" style={{fontSize: '50px'}} />
                </p>
                <p className="ant-upload-text">Click or drag your photo picture to this area to upload</p>
                <p className="ant-upload-hint">Notes: Format support .jpeg .jpg .png</p>
            </Dragger>
        </div>
    )
}

export default withAuth(UploadPhoto);