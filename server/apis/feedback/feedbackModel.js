const mongoose = require('mongoose')
const feedbackSchema = mongoose.Schema({
    feedbackId: { type: Number, default: 0 },
    bookingId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'booking' },
    userId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'user' },
    message: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    status: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now }

})


const feedback = module.exports = mongoose.model('feedback', feedbackSchema)
