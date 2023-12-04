const Booking = require('./bookingModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    // if (!!req.decoded && req.decoded.userType != 1)
    //     req.body.subServiceId = req.decoded._id
    await Booking.find(req.body)
        .populate("subServiceId")
        .populate("userId")
        .populate("vendorId")
        .then(res => {
            resp.send({ success: true, status: 200, message: "All Bookings loaded", data: res })
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
        await Booking.findOne(query)
            .populate("vendorId")
            .populate("subServiceId")
            .populate("userId")
            .then(res => {
                if (!!res) {
                    resp.send({ success: true, status: 200, message: "Booking loaded Successfully", data: res })
                }
                else
                    resp.send({ success: false, status: 404, message: "No Booking Found" })
            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }


}



exports.addBooking = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.vendorId)
        validation += "vendorId is required,"
    if (!formData.subServiceId)
        validation += "subServiceId is required,"
    if (!formData.userId)
        validation += "userId is required,"
    if (!formData.dateOfBooking)
        validation += "dateOfBooking is required,"
    if (!formData.cost)
        validation += "cost is required,"
    if (!formData.description)
        validation += "description is required,"
    if (!formData.name)
        validation += "name is required,"
    if (!formData.contact)
        validation += "contact is required,"
    if (!formData.address)
        validation += "address is required,"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {


        let total = await Booking.countDocuments()
        let bookingData = {
            bookingId: total + 1,
            vendorId: formData.vendorId,
            subServiceId: formData.subServiceId,
            userId: formData.userId,
            dateOfBooking: formData.dateOfBooking,
            cost: formData.cost,
            description: formData.description,
            name: formData.name,
            address: formData.address,
            contact: formData.contact
        }

        let booking = new Booking(bookingData)
        booking.save().then(res => {
            resp.send({ success: true, status: 200, message: "Booking added Successfully", data: res })

        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })


    }
}



// exports.updateBooking = async (req, resp) => {
//     let formData = req.body
//     let validation = ""
//     if (!formData._id)
//         validation += "_id is required"
//     if (!!validation)
//         resp.send({ success: false, status: 422, message: validation })
//     else {
//         let query = { _id: formData._id }
//         await Booking.findOne(query).then(async res => {
//             if (!!res) {
//                 let isInValid = false
//                 if (!!formData.bookingStatus) {
//                     if (formData.bookingStatus == 5 && res.bookingStatus > 2) {
//                         isInValid = true
//                     } else {
//                         res.bookingStatus = formData.bookingStatus
//                     }
//                 }
//                 if (!!formData.trackingId)
//                     res.trackingId = formData.trackingId
//                 if (!!formData.shipmentUrl)
//                     res.shipmentUrl = formData.shipmentUrl
//                 if (isInValid)
//                     resp.send({ success: true, status: 200, message: "Booking cannot be cancelled" })
//                 else
//                     res.save().then(res => {
//                         resp.send({ success: true, status: 200, message: "Booking updated Successfully", data: res })

//                     }).catch(err => {
//                         resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
//                     })
//             }
//             else
//                 resp.send({ success: false, status: 404, message: "No Booking Found" })
//         }).catch(err => {
//             resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
//         })
//     }
//     //   }


// }

exports.changeStatus = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!formData.bookingStatus)
        validation += "bookingStatus is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Booking.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.bookingStatus)
                    res.bookingStatus = formData.bookingStatus

                res.save().then(res => {
                    resp.send({ success: true, status: 200, message: "Booking Status Changed Successfully", data: res })

                }).catch(err => {
                    resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                })
            }
            else
                resp.send({ success: false, status: 404, message: "No Booking Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
}

