const mongoose = require('mongoose')
const serviceSchema = mongoose.Schema({

    serviceId: { type: Number, default: 0 },
    
    name: { type: String, default: "" },
    image: { type: String, default: "service/default.jpg" },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }

})


const Service = module.exports = mongoose.model('service', serviceSchema)
