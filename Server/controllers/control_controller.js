const controlModel   = require('../models/control_model')
const uuid           = require('shortid')

exports.index = async (req, res) => {
    try {
        controlModel.find({ userId: req.id_user }).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(500).json({ status: "Error", code: "500", msg: "Internal Server Error"})
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.findOne = async (req, res) => {
    try {
        controlModel.findOne({ _id: req.params.id }).then((data) => {
            if(data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ status: 'Error', code: 404, msg: 'Graph Not Found!'})
            }            
        }).catch((err) => {
            console.log(err)
            res.status(400).json({ status: 'Error', code: 500, msg: 'Internal Server Error' })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.create = async (req, res) => {
    try {
        const id         = uuid.generate()
        const controller = req.body.controller_name ? req.body.controller_name : null
        const desc       = req.body.desc ? req.body.desc : null
        
        if(controller === null || desc === null) {
            res.status(200).json({ 
                Error: 'BAD REQUEST', 
                Code: 400, 
                msg: 'Please fill all required fields!',
                BODY_DATA_REQUIRED:  {
                    graph_name: {
                        type: 'String',
                        require: true
                    },
                    desc: {
                        type: 'LongText',
                        require: true
                    }
                }
            })
        } else {
            const dataBody  = { 
                _id                 : id,
                userId              : req.id_user,
                controller          : controller, 
                desc                : desc,
                controller_default  : 0
            }

            console.log(dataBody._id)

            controlModel.create(dataBody)
                .then(data => {
                    res.status(201).json({ status: 'Success', code: 200, 'msg': 'Success to saving data!', data: data})
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed to saving data!'})
                })   
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.edit = async (req, res) => {
    const controller    = req.body.controller_name
    const desc          = req.body.desc

    try {
        if(controller.trim() === "" || desc.trim() === "" || controller === null || desc === null) {
            res.status(200).json({ 
                Error: 'BAD REQUEST', 
                Code: 400, 
                msg: 'Please fill all required fields!',
                BODY_DATA_REQUIRED:  {
                    graph_name: {
                        type: 'String',
                        require: true
                    },
                    desc: {
                        type: 'LongText',
                        require: true
                    },
                    share: {
                        type: 'Number',
                        require: true
                    }
                }
            })
        } else {
            const dataBody  = { 
                controller  : controller, 
                desc        : desc
            }
            
            controlModel.findByIdAndUpdate({ _id: req.params.id }, 
                { 
                    $set: { 
                        ...dataBody
                    }
                })
                .then(data => {
                    res.status(200).json({ status: 'Success', code: 200, 'msg': 'Success update data!', data: data})
                })
                .catch(err => {
                    res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed update data!'})
                    console.log(err)
                })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.defaultControl = async (req, res) => {

    const setDefault = (data, err) => {
        return controlModel.findByIdAndUpdate({ _id: data.id }, 
            { 
                $set: { 
                    controller_default: data.status
                }
            })
            .then(data => {
                err(false)
            })
            .catch(err => {
                console.log(err)
                err(true)
            }) 
    }

    try {
        controlModel.findOne({ graph_default: 1})
            .then((data) => {
                if(data) { 
                    setDefault({ id: data._id, status: 2}, err => {
                        if(!err) {
                            setDefault({ id: req.params.id, status: 1 }, err => {
                                if(!err) {
                                    res.status(200).json({ status: 'Success', code: 200, 'msg': 'Success change default graph!'})
                                } else {
                                    res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed change default graphasd!'})
                                }
                            })
                        } else {
                            res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed change default graphxc!'})
                        }
                    })
                } else { 
                    console.log(data)
                    setDefault({ id: req.params.id, status: 1 }, err => {
                        if(!err) {
                            res.status(200).json({ status: 'Success', code: 200, 'msg': 'Success change default graph!'})
                        } else {
                            res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed change default graph!'})
                        }
                    })
                }         
        }).catch((err) => {
            console.log(err)
            res.status(400).json({ status: 'Error', code: 500, msg: 'Internal Server Error' })
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.delete = async (req, res) => {
    try {
        controlModel.deleteMany({ _id: req.body.id })
        .then(data => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ status: 'Failed', code: 500, 'msg' : 'Failed delete data!'})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: 400, msg:'Internal Server Error'})
    }
}

exports.widget_create = async (req, res) => {
    try {

        const bodyData = {
            _id : uuid.generate(),
            widgetTitle : req.body.widgetTitle,
            resourceId : req.body.resourceId,
            widgetDisplay : req.body.widgetDisplay,
            dataId : req.body.dataId,
            dataValue : 0,
            eventOn: {
                widget: req.body.eventOnWidgetTarget,
                action: req.body.eventOnActionTarget,
                activate: req.body.eventOnActive
            },
            eventOff: {
                widget: req.body.eventOffWidgetTarget,
                action: req.body.eventOffActionTarget,
                activate: req.body.eventOffActive
            }
        }

        controlModel.findOneAndUpdate({ _id: req.params.controllerId }, { 
            $addToSet: { controller_widget: {
                ...bodyData
            }}
        })
        .then((cb) => {
            if(cb) {
                res.status(201).json({ status: 'Success', code: 200, msg:`Success saving data.`})
            } else {
                res.status(404).json({ status: 'Error', code: 404, msg: 'Widget not found!'})
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ status: 'Error', code: 500, msg: 'Internal Server Error!'})
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.widget_update = async (req, res) => {
    try {
        const bodyData = {
            'controller_widget.$.widgetTitle' : req.body.widgetTitle,
            'controller_widget.$.resourceId' : req.body.resourceId,
            'controller_widget.$.widgetDisplay' : req.body.widgetDisplay,
            'controller_widget.$.dataId' : req.body.dataId,
            'controller_widget.$.eventOn' : {
                widget: req.body.eventOnWidgetTarget,
                action: req.body.eventOnActionTarget,
                activate: req.body.eventOnActive
            },
            'controller_widget.$.eventOff' : {
                widget: req.body.eventOffWidgetTarget,
                action: req.body.eventOffActionTarget,
                activate: req.body.eventOffActive
            }
        }

        controlModel.findOneAndUpdate({ _id: req.params.controllerId, 'controller_widget._id': req.params.widgetId  }, { 
            $set: bodyData
        })
        .then((cb) => {
            if(cb) {
                res.status(200).json({ status: 'Success', code: 200, msg:`Updating widget is success.`})
            } else {
                res.status(404).json({ status: 'Error', code: 404, msg: 'Widget not found!'})
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ status: 'Error', code: 500, msg: 'Internal Server Error!'})
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.widgetData_update = async (req, res) => {
    try {
        controlModel.findOneAndUpdate({ _id: req.params.controllerId, 'controller_widget._id': req.params.widgetId }, { 
            $set: { 
                'controller_widget.$.dataValue': req.body.dataValue
            }
        })
        .then((cb) => {
            if(cb) {
                res.status(200).json({ status: 'Success', code: 200, msg:`Updating widget is success.`})
            } else {
                res.status(200).json({ status: 'Error', code: 404, msg: 'Widget not found!'})
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ status: 'Error', code: 500, msg: 'Internal Server Error!'})
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.widget_delete = async (req, res) => {
    try {
        controlModel.findOneAndUpdate({ _id: req.params.controllerId, 'controller_widget._id': req.params.widgetId }, {
            $pull: { controller_widget : { 
                _id: req.params.widgetId 
            }}
        })
        .then((cb) => {
            if(cb) {
                res.status(200).json({ status: 'Success', code: 200, msg:`Deleting widget is success.`})
            } else {
                res.status(404).json({ status: 'Error', code: 404, msg: 'Widget not found!'})
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ status: 'Error', code: 500, msg: 'Internal Server Error!'})
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.widget_layouts = async (req, res) => {
    try {
        if (req.body.layouts) {
            controlModel.findByIdAndUpdate({ _id: req.params.id }, 
                { 
                    $set: { 
                        ...req.body
                    }
                })
                .then(data => {
                    res.status(200).json({ status: 'Success', code: 200, 'msg': 'Success update data graph!', data: data})
                })
                .catch(err => {
                    res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed update data graph!'})
                    console.log(err)
                })
        }
        else {
            console.log(error)
            res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}
