const Customer = require('./customerModel')
const User = require('../user/userModel')
const helper = require('../../utilities/helpers')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken')

// exports.login = async (req, resp) => {
//     let formData = req.body
//     let validation = ""
//     if (!formData.email && !formData.password)
//         validation += "email and password is required"
//     if (!!validation)
//         resp.send({ success: false, status: 422, message: validation })
//     else {
//         let query = { email: formData.email }
//         await Customer.findOne(query).then(res => {
//             if (!!res) {
//                 if (bcrypt.compareSync(formData.password, res.password)) {
//                     var user = {
//                         name: res.name, email: res.email, isAdmin: res.isAdmin, _id: res._id
//                     }
//                     let token = jwt.sign(user, helper.SECRET)
//                     resp.send({ success: true, status: 200, message: "Login Successful", token: token, data: res })
//                 }
//                 else resp.send({ success: false, status: 403, message: "Invalid Credentials" })
//             }
//             else
//                 resp.send({ success: false, status: 404, message: "No Customer Found" })
//         }).catch(err => {
//             resp.send({ success: false, status: 404, message: !!err.message ? err.message : err })
//         })
//     }

// }



exports.getAll = async (req, resp) => {
    await Customer.find(req.body).populate('userId').then(res => {
        resp.send({ success: true, status: 200, message: "All Customers loaded", data: res })
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

    let query = { userId: formData._id }
    await Customer.findOne(query).populate('userId').then(res => {
        if (!!res) {
            resp.send({ success: true, status: 200, message: "Customer loaded Successfully", data: res })
        }
        else
            resp.send({ success: false, status: 404, message: "No Customer Found" })
    }).catch(err => {
        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
    })
}




exports.addCustomer = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.firstName)
        validation += "firstName is required,"
    if (!formData.address)
        validation += "address is required,"
    if (!formData.dob)
        validation += "dob is required,"
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
                userType: 2
            }
            let user = new User(UserData)
            let prevUser = await User.findOne({ email: formData.email })
            if (prevUser)
                resp.send({ success: false, status: 409, message: "User already exists with same email" })
            else
                user.save().then(async (res) => {
                    let customertotal = await Customer.countDocuments()
                    let customerData = {}

                    customerData.customerId = customertotal + 1
                    customerData.firstName = formData.firstName
                    if (!!formData.lastName)
                        customerData.lastName = formData.lastName
                    customerData.address = formData.address
                    customerData.dob = formData.dob
                    customerData.gender = formData.gender
                    customerData.contact = formData.contact
                    customerData.email = formData.email
                    customerData.password = res.password
                    customerData.userId = res._id
        
                    let customer = new Customer(customerData)
                    customer.save().then(res => {
                        resp.send({ success: true, status: 200, message: "Customer added Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
                }).catch(err => {
                    resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                })
    }
}



exports.updateCustomer = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query1 = { userId: formData._id }
        await Customer.findOne(query1).then(async res => {
            if (!!res) {
                if (!!formData.firstName)
                    res.firstName = formData.firstName
                if (!!formData.lastName)
                    res.lastName = formData.lastName
                if (!!formData.address)
                    res.address = formData.address
                if (!!formData.dob)
                    res.dob = formData.dob
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
                if (prevUser){
                    resp.send({ success: false, status: 409, message: "User already exists with same email" })
                }
                else
                    res.save().then(async customerData => {
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
                                    resp.send({ success: true, status: 200, message: "Customer updated Successfully", data: customerData })
            
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
                resp.send({ success: false, status: 404, message: "No Customer Found" })
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
        await User.findOne(query).then(res => {
            if (!!res) {
                if (!!formData.status)
                    res.status = formData.status
                res.save().then(async res => {
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