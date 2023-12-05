const Service = require('./serviceModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    try {
        const services = await Service.find(req.body);

        const servicesWithUrl = await Promise.all(
            services.map(async (service) => {
                const signedurl = await helper.generatePresignedUrl(
                    process.env.BUCKET_NAME,
                    service.image
                );
                return {
                    ...service.toObject(),
                    signedurl
                }
            })
        )
        resp.send({
            success: true,
            status: 200,
            message: "All Services loaded",
            data: servicesWithUrl,
        });
    }
    catch (err) {
        resp.send({
            success: false,
            status: 500,
            message: !!err.message ? err.message : err,
        });
    }
}




exports.getSingle = async (req, resp) => {
    let formData = req.body;
    let validation = "";

    if (!formData._id)
        validation += "_id is required";

    if (!!validation) {
        resp.send({ success: false, status: 422, message: validation });
        return; // Exit the function early if there are validation errors
    }

    let query = { _id: formData._id };

    try {
        const service = await Service.findOne(query);

        if (!!service) {
            // Generate a pre-signed URL for the S3 object
            const signedUrl = await helper.generatePresignedUrl(
                process.env.BUCKET_NAME,
                service.image
            );

            resp.send({
                success: true,
                status: 200,
                message: "Service loaded Successfully",
                data: { ...service.toObject(), signedUrl },
            });
        } else {
            resp.send({ success: false, status: 404, message: "No Service Found" });
        }
    } catch (err) {
        resp.send({
            success: false,
            status: 500,
            message: !!err.message ? err.message : err,
        });
    }
};



exports.addService = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.name)
        validation += "name is required,"
    if (!req.file )
        validation += "image is required, ";


    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let total = await Service.countDocuments()
        let serviceData = {
            serviceId: total + 1,
            name: formData.name,
            image:req.file.key,
        }
        let service = new Service(serviceData)
        let prevService = await Service.findOne({ name: formData.name })
        if (prevService)
            resp.send({ success: false, status: 409, message: "Service already exists with same name" })
        else
            service.save().then(res => {
                resp.send({ success: true, status: 200, message: "Service added Successfully", data: res })

            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })

            })
    }


}



exports.updateService = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Service.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.name)
                    res.name = formData.name
                if (!!req.file ){
                    helper.unlinkImage(res.image)
                    res.image = req.file.key
                }
                let id = res._id
                let prevService = await Service.findOne({ $and: [{ name: res.name }, { _id: { $ne: id } }] })
                if (prevService)
                    resp.send({ success: false, status: 409, message: "Service already exists with same name" })
                else
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "Service updated Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No Service Found" })
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
        await Service.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.status)
                    res.status = formData.status

                res.save().then(res => {
                    resp.send({ success: true, status: 200, message: "service Status Changed Successfully", data: res })

                }).catch(err => {
                    resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                })
            }
            else
                resp.send({ success: false, status: 404, message: "No service Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
}