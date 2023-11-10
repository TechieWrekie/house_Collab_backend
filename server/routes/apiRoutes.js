const router = require('express').Router()
const helper = require('../utilities/helpers')


//controllers
const userController = require('../apis/user/userController')
const customerController = require('../apis/customer/customerController')
const vendorController = require('../apis/vendor/vendorController')

const serviceController = require('../apis/service/serviceController')
const contactController = require('../apis/contact/contactController')
const subServiceController = require('../apis/subService/subServiceController')
const bookingController = require('../apis/booking/bookingController')
const feedbackController = require('../apis/feedback/feedbackController')
const dashboardController = require('../apis/dashboard/dashboardController')

//auth
router.post('/user/login', userController.login)


//customer
router.post('/customer/add', customerController.addCustomer)
router.post('/customer/update', customerController.updateCustomer)

//vendor
router.post('/vendor/add', helper.uploadImageFun.single('vendor_image'), vendorController.addVendor)
router.post('/vendor/all', vendorController.getAll)
router.post('/vendor/single', vendorController.getSingle)
//service
router.post('/service/all', serviceController.getAll)
router.post('/service/single', serviceController.getSingle)

// contact
router.post('/contact/add',  contactController.addContact)


//subService
router.post('/subService/all', subServiceController.getAll)
router.post('/subService/single', subServiceController.getSingle)


router.use(require('../middleware/tokenChecker'))

//dashboard
router.get('/dashboard', dashboardController.dashboard)
router.post('/vendor/dashboard', dashboardController.vendorDashboard)


//customer
router.post('/customer/all', customerController.getAll)
router.post('/customer/single', customerController.getSingle)
router.post('/customer/changeStatus', customerController.changeStatus)

//vendor
router.post('/vendor/update', helper.uploadImageFun.single('vendor_image'), vendorController.updateVendor)
router.post('/vendor/changeStatus', vendorController.changeStatus)

//service

router.post('/service/add', helper.uploadImageFun.single('service_image'), serviceController.addService)
router.post('/service/update', helper.uploadImageFun.single('service_image'), serviceController.updateService)
router.post('/service/changeStatus', serviceController.changeStatus)
//contact

router.post('/contact/all', contactController.getAll)
router.post('/contact/single', contactController.getSingle)
// router.post('/contact/update', contactController.updateContact)

//subService

router.post('/subService/add', helper.uploadImageFun.single('subService_image'), subServiceController.addSubService)
router.post('/subService/update', helper.uploadImageFun.single('subService_image'), subServiceController.updateSubService)
router.post('/subService/changeStatus', subServiceController.changeStatus)

//customer
router.post('/booking/all', bookingController.getAll)
router.post('/booking/single', bookingController.getSingle)
router.post('/booking/add', bookingController.addBooking)
// router.post('/booking/update', bookingController.updateBooking)
router.post('/booking/changeStatus', bookingController.changeStatus)


router.post('/feedback/all', feedbackController.getAll)
router.post('/feedback/single', feedbackController.getSingle)
router.post('/feedback/add', feedbackController.addFeedback)
// router.post('/feedback/update', feedbackController.updateBooking)
router.post('/feedback/changeStatus', feedbackController.changeStatus)


router.all('*', (req, res) => {
    res.send({
        success: false,
        status: 404,
        message: "Invalid Address"
    })
})

module.exports = router