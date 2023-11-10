const User = require('../user/userModel')
const Service = require('../service/serviceModel')
const SubService = require('../subService/subServiceModel')
const Booking = require('../booking/bookingModel')
const Contact = require('../contact/contactModel')
const Feedback = require('../feedback/feedbackModel')


exports.dashboard = async (req, res) => {
    let totalCustomers = await User.find({ userType: 2 })
    let totalVendors = await User.find({ userType: 3 })
    let totalContacts = await Contact.countDocuments()
    let totalFeedbacks = await Feedback.countDocuments()
    let totalBookings = await Booking.countDocuments()
    let totalServices = await Service.countDocuments()
    let totalSubServices = await SubService.countDocuments()
    res.send({ success: true, status: 200, 
        totalBookings: totalBookings, 
        totalServices: totalServices, 
        totalSubServices: totalSubServices, 
        totalCustomers: totalCustomers.length, 
        totalVendors: totalVendors.length, 
        totalContacts: totalContacts,
        totalFeedbacks: totalFeedbacks, })
}

exports.vendorDashboard = async (req, res) => {
    let totalBookings = await Booking.find({vendorId:req.body._id})
    let totalSubServices = await SubService.find({vendorId:req.body._id})
    res.send({ success: true, status: 200, 
        totalBookings: totalBookings.length, 
        totalSubServices: totalSubServices.length,  })
}
