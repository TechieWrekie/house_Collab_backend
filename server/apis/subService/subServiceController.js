const SubService = require('./subServiceModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    await SubService.find(req.body)
        .populate("serviceId")
        .populate("vendorId")
        .then(res => {
            resp.send({ success: true, status: 200, message: "All SubServices loaded", data: res })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
}



exports.getSingle = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"

    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await SubService.findOne(query)
            .populate("serviceId")
            .populate("vendorId").then(res => {
                if (!!res) {
                    resp.send({ success: true, status: 200, message: "SubService loaded Successfully", data: res })
                }
                else
                    resp.send({ success: false, status: 404, message: "No SubService Found" })
            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }


}



exports.addSubService = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.name)
        validation += "name is required,"
    if (!formData.image)
        validation += "image is required,"
    if (!formData.serviceId)
        validation += "serviceId is required,"
    if (!formData.vendorId)
        validation += "vendorId is required,"
    if (!formData.price)
        validation += "price is required,"
    if (!formData.description)
        validation += "description is required,"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let total = await SubService.countDocuments()
        let subServiceData = {
            subServiceId: total + 1,
            price: formData.price,
            serviceId: formData.serviceId,
            vendorId: formData.vendorId,
            name: formData.name,
            description: formData.description,
            image: "subService/" + formData.image
        }
        let subService = new SubService(subServiceData)
            subService.save().then(res => {
                resp.send({ success: true, status: 200, message: "SubService added Successfully", data: res })

            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }
}



exports.updateSubService = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await SubService.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.name)
                    res.name = formData.name
                if (!!formData.image){
                    helper.unlinkImage(res.image)
                    res.image = "subService/" + formData.image
                }
                if (!!formData.serviceId)
                    res.serviceId = formData.serviceId
                if (!!formData.vendorId)
                    res.vendorId = formData.vendorId
                if (!!formData.price)
                    res.price = formData.price
                if (!!formData.description)
                    res.description = formData.description
                res.save().then(res => {
                    resp.send({ success: true, status: 200, message: "SubService updated Successfully", data: res })

                }).catch(err => {
                    resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                })
            }
            else
                resp.send({ success: false, status: 404, message: "No SubService Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
}

exports.changeStatus = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!formData.status)
        validation += "status is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await SubService.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.status)
                    res.status = formData.status
                
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "SubService Status Changed Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No SubService Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
}