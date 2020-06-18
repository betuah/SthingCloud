import React, { useState } from 'react'
import { Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import MaterialIcon from 'components/MaterialIcon'
import { withAuth } from 'components/Auth/context/AuthContext'
import notif from 'components/NotificationPopUp/notif'

const Dragger = Upload.Dragger

const UploadPhoto = props => {
    const { axios, server_url } = props

    const [fileList, setFileList] = useState([])

    const beforeCrop = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg'
        const isLt5M = file.size / 1024 / 1024 < 5

        if (!isJpgOrPng) {
            notif('warning', 'Bad Format!' , 'You can only upload JPG/PNG/JPEG file format!')
            return false
        }
        
        if (!isLt5M) {
            notif('warning', 'File Size!' , 'Image must smaller than 5MB!')
            return false
        }
        // return true
        return isJpgOrPng && isLt5M
    }

    const customDraggerProps = {
        name: 'file',
        multiple: false,
        fileList: fileList,
        accept: '.png,.jpeg,.jpg,image/png,image/jpeg,image/jpg',
        action: `${server_url}/api/user/avatar/upload`,
        showUploadList: {
            showRemoveIcon: false
        },
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
            }).catch(err => {
                notif('warning', 'Upload Failed!' , 'Maybe the image file format you entered is incorrect or the image file is corrupt.')
            })
            
        },
        beforeUpload: beforeCrop,
        onChange(info) {
            const status = info.file.status
            let fileList = [...info.fileList]

            fileList = fileList.slice(-1)
            fileList = fileList.map(file => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            })            
            
            setFileList(fileList)
            
            if (status === 'done') {
                notif('success', 'Upload Finish!' , 'Uploaded photo picture successfully.')
            } else if (status === 'error') {
                notif('error', 'Upload Failed!' , 'Uploaded photo picture failed.')
            }
        },
    }

    return(
        <div className="h-50">
            <ImgCrop rotate beforeCrop={beforeCrop}>
                <Dragger {...customDraggerProps}>
                    <p className="ant-upload-drag-icon">
                        <MaterialIcon icon="inbox" style={{fontSize: '50px'}} />
                    </p>
                    <p className="ant-upload-text">Click or drag your photo picture to this area to upload</p>
                    <p className="ant-upload-hint">Notes: Format support .jpeg .jpg .png and must smaller than 5 mb</p>
                </Dragger>
            </ImgCrop>
        </div>
    )
}

export default withAuth(UploadPhoto);