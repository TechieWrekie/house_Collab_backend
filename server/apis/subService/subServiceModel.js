const mongoose = require('mongoose')
const subServiceSchema = mongoose.Schema({
    subServiceId: { type: Number, default: 0 },

    vendorId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'user' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'service' },
    
    price: { type: Number, default: 0 },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "subService/default.jpg" },
    
    status: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now }

})


const SubService = module.exports = mongoose.model('subService', subServiceSchema)
