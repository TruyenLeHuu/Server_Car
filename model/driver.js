const mongoose = require('mongoose')
const Schema  = mongoose.Schema
const driver = new Schema ({
    rfid:{
        type:String
    },
    name:{
        type:String
    },
    gender:{
        type:Number
    },
    age:{
        type:Number
    }
})
const driverModel = mongoose.model('Drivers', driver)
module.exports= driverModel