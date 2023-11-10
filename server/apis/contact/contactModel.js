const mongoose = require('mongoose')
const contactSchema = mongoose.Schema({

    contactId: { type: Number, default: 0 },
    
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, default: "" },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }

})


const Contact = module.exports = mongoose.model('contact', contactSchema)
