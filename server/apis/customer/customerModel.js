const mongoose = require('mongoose')
const customerSchema = mongoose.Schema({
    customerId: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, default:null, ref:'user'},
    
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },

    address: { type: String, default: "" },
    dob:{type:Date, default:Date.now},
    gender: { type: String, default: "" },
    
    contact: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    
    
    
})


const Customer = module.exports = mongoose.model('customer', customerSchema)
