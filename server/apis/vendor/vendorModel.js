const mongoose = require('mongoose')
const vendorSchema = mongoose.Schema({
    vendorId: { type: Number, default: 0 },
    serviceId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:'service'},
    userId: { type: mongoose.Schema.Types.ObjectId, default:null, ref:'user'},
    
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },

    address: { type: String, default: "" },
    dob: {type:Date, default:Date.now},
    aadharNo: { type: String, default: "" },
    image: { type: String, default: "vendor/default.jpg" },

    gender: { type: String, default: "" },

    contact: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" }
})


const Vendor = module.exports = mongoose.model('vendor', vendorSchema)
