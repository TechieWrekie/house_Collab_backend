const mongoose = require('mongoose')
const bookingSchema = mongoose.Schema({
    bookingId: { type: Number, default: 0 },
    vendorId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "user" },
    subServiceId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "subService" },
    
    userId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "user" },

    dateOfBooking: { type: Date, default: Date.now },
    cost: { type: Number, default: 0 },
    description: { type: String, default: "" },

    name: { type: String, default: "" },
    address: { type: String, default: "" },
    contact: { type: String, default: "" },

    bookingStatus: { type: String, default: 'pending' }, // approved, completed, canceled

    createdAt: { type: Date, default: Date.now }

})



const Booking = module.exports = mongoose.model('booking', bookingSchema)