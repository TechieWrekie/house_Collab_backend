const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    userId: { type: Number, default: 0 },

    name: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    userType: { type: Number, default: 0 },// 1=> Admin, 2=> Customer , 3=> Vendor 

    createdAt: { type: Date, default: Date.now },
    status: { type:Boolean, default:true }
})


const User = module.exports = mongoose.model('user', userSchema)
