const Feedback = require('./feedbackModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    await Feedback.find(req.body)
        .populate("bookingId").populate("userId")
        .then(res => {
            resp.send({ success: true, status: 200, message: "All Feedback loaded", data: res })
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

    let query = { _id: formData._id }
    await Feedback.findOne(query)
        .populate("bookingId").populate("userId")
        .then(res => {
            if (!!res) {
                resp.send({ success: true, status: 200, message: "Feedback loaded Successfully", data: res })
            }
            else
                resp.send({ success: false, status: 404, message: "No Feedback Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })

}




exports.addFeedback = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.message)
        validation += "message is required,"
    if (!formData.rating)
        validation += "rating is required,"
    if (!formData.bookingId)
        validation += "bookingId is required,"
    if (!formData.userId)
        validation += "userId is required,"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let total = await Feedback.countDocuments()
        let feedbackData = {
            feedbackId: total + 1,
            userId: formData.userId, 
            bookingId: formData.bookingId,
            message: formData.message,
            rating: formData.rating
        }
        let feedback = new Feedback(feedbackData)
        
        feedback.save().then(res => {
            resp.send({ success: true, status: 200, message: "Feedback added Successfully", data: res })

        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }


}



// exports.updateFeedback = async (req, resp) => {
//     let formData = req.body
//     let validation = ""
//     if (!formData._id)
//         validation += "_id is required"

//     if (!!validation)
//         resp.send({ success: false, status: 422, message: validation })
//     else {
//         let query = { _id: formData._id }
//         await Feedback.findOne(query).then(async res => {
//             if (!!res) {
//                 if (!!formData.name)
//                     res.name = formData.name
//                 if (!!formData.bookingId)
//                     res.bookingId = formData.bookingId
//                 if (!!formData.image)
//                     res.image = "feedback/" + formData.image
//                 if (!!formData.status)
//                     res.status = formData.status
//                 let id = res._id
//                 let prevFeedback = await Feedback.findOne({ $and: [{ name: res.name }, { _id: { $ne: id } }] })
//                 if (prevFeedback)
//                     resp.send({ success: false, status: 409, message: "Feedback already exists with same name" })
//                 else
//                     res.save().then(res => {
//                         resp.send({ success: true, status: 200, message: "Feedback updated Successfully", data: res })

//                     }).catch(err => {
//                         resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
//                     })
//             }

//             else
//                 resp.send({ success: false, status: 404, message: "No Feedback Found" })
//         }).catch(err => {
//             resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
//         })
//     }

// }

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
        await Feedback.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.status)
                    res.status = formData.status
                
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "feedback Status Changed Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No feedback Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
}