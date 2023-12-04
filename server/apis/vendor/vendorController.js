const Vendor = require('./vendorModel')
const User = require('../user/userModel')
const helper = require('../../utilities/helpers')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken')

exports.getAll = async (req, resp) => {

    try {
        const vendors = await Vendor.find(req.body).populate('serviceId').populate('userId')

        const vendrosWithUrl = await Promise.all(
            vendors.map(async (vendor) => {
                const signedUrl = await helper.generatePresignedUrl(
                    process.env.BUCKET_NAME,
                    vendor.image
                )
                return {
                    ...vendor.toObject(),
                    signedUrl
                }
            })
        )
        resp.send({
            success: true,
            status: 200,
            message: "All Vendors loaded",
            data: vendrosWithUrl,
        })
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
    try {
        let formData = req.body
        let validation = ""
        if (!formData._id)
            validation += "_id is required"
        if (!!validation)
            resp.send({ success: false, status: 422, message: validation })

        let query = { userId: formData.userId }
        const vendor = await Vendor.findOne(query).populate('serviceId')
        if (!!vendor) {
            const signedUrl = await helper.generatePresignedUrl(
                process.env.BUCKET_NAME,
                vendor.image
            )
            resp.send({
                success: true,
                status: 200,
                message: "Service loaded Successfully",
                data: { ...vendor.toObject(), signedUrl },
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


exports.addVendor = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.serviceId)
        validation += "serviceId is required,"
    if (!formData.firstName)
        validation += "firstName is required,"
    if (!formData.address)
        validation += "address is required,"
    if (!formData.dob)
        validation += "dob is required,"
    if (!formData.aadharNo)
        validation += "aadharNo is required,"
    if (!req.file || !req.file.fieldname)
        validation += "image is required,"
    if (!formData.gender)
        validation += "gender is required,"
    if (!formData.contact)
        validation += "contact is required,"
    if (!formData.email)
        validation += "email is required,"
    if (!formData.password)
        validation += "password is required,"

    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let usertotal = await User.countDocuments()
        let UserData = {
            userId: usertotal + 1,
            name: formData.firstName,
            email: formData.email,
            password: bcrypt.hashSync(formData.password, salt),
            userType: 3,
            status: false
        }
        let user = new User(UserData)
        let prevUser = await User.findOne({ email: formData.email })
        if (prevUser)
            resp.send({ success: false, status: 409, message: "User already exists with same email" })
        else
            user.save().then(async res => {
                let vendortotal = await Vendor.countDocuments()
                let vendorData = {}

                vendorData.vendorId = vendortotal + 1
                vendorData.serviceId = formData.serviceId
                vendorData.firstName = formData.firstName
                if (!!formData.lastName)
                    vendorData.lastName = formData.lastName
                vendorData.address = formData.address
                vendorData.dob = formData.dob
                vendorData.aadharNo = formData.aadharNo
                vendorData.image = req.file.key
                vendorData.gender = formData.gender
                vendorData.contact = formData.contact
                vendorData.email = formData.email
                vendorData.password = res.password
                vendorData.userId = res._id

                let vendor = new Vendor(vendorData)
                vendor.save().then(res => {
                    resp.send({ success: true, status: 200, message: "Vendor added Successfully", data: res })

                }).catch(err => {
                    resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                })
            }).catch(err => {
                console.error("Error uploading image:", req.fileValidationError || req.fileError);
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }
}



exports.updateVendor = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query1 = { userId: formData._id }
        await Vendor.findOne(query1).then(async res => {
            if (!!res) {
                if (!!formData.serviceId)
                    res.serviceId = formData.serviceId
                if (!!formData.firstName)
                    res.firstName = formData.firstName
                if (!!formData.lastName)
                    res.lastName = formData.lastName
                if (!!formData.address)
                    res.address = formData.address
                if (!!formData.city)
                    res.city = formData.city
                if (!!formData.aadharNo)
                    res.aadharNo = formData.aadharNo
                if (!!req.file || !!req.file.fieldname) {
                    helper.unlinkImage(res.image)
                    res.image = req.file.key
                }
                if (!!formData.gender)
                    res.gender = formData.gender
                if (!!formData.contact)
                    res.contact = formData.contact
                if (!!formData.email)
                    res.email = formData.email
                if (!!formData.password)
                    res.password = bcrypt.hashSync(formData.password, salt)
                let id = res.userId
                let prevUser = await User.findOne({ $and: [{ email: res.email }, { _id: { $ne: id } }] })
                if (prevUser) {
                    resp.send({ success: false, status: 409, message: "User already exists with same email" })
                }
                else
                    res.save().then(async vendorData => {
                        let query2 = { _id: formData._id }
                        await User.findOne(query2).then(async UserData => {
                            if (!!UserData) {
                                if (!!formData.name)
                                    UserData.name = formData.firstName
                                if (!!formData.email)
                                    UserData.email = formData.email
                                if (!!formData.password)
                                    UserData.password = bcrypt.hashSync(formData.password, salt)

                                UserData.save().then(res => {
                                    resp.send({ success: true, status: 200, message: "Vendor updated Successfully", data: vendorData })

                                }).catch(err => {
                                    resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                                })
                            }
                            else
                                resp.send({ success: false, status: 404, message: "No User Found" })

                        }).catch(err => {
                            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                        })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No Vendor Found" })
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
        await User.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.status)
                    res.status = formData.status

                res.save().then(res => {
                    resp.send({ success: true, status: 200, message: "User Status Changed Successfully", data: res })

                }).catch(err => {
                    resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                })
            }
            else
                resp.send({ success: false, status: 404, message: "No User Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
}