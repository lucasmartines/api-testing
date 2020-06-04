// import mongoose from '../config/database'
const mongoose = require('../config/database')

const carsModel = mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

const Carro = mongoose.model('Carro',carsModel)



module.exports = Carro







