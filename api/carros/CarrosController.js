const express = require('express')
const Cars = require('../../models/carsModel.js')
const mongoose = require('mongoose')
const carrosControllerV1 = express.Router()

// console.log( process.env.NODE_ENV )

const router = "/api/v1/carros"

carrosControllerV1.get('/',async function(req,res){

    let carros = await Cars.find().exec()

    res.json( carros )
})


carrosControllerV1.post('/',async function(req,res){

    let _cars

    try{
        _cars = await Cars.create(req.body)
    }
    catch (e) {
        return res.status(400).send( { error : "Não foi possivel buscar um carro "+ e  } )
    }

    res.status(201).json( _cars )
})

carrosControllerV1.put('/:_id',async function(req,res){

    let _id = req.params._id ? req.params._id : false

    if( !isIdValid(_id,res)) {

        res.status(400).json({error:"error invalid _id"})    
        return 
    } 
    if(  _id == false  ) {

        sendError(!_id,res,400,null,"Is not possible to delete a car without id")
        return
    }

    let car = await Cars.findByIdAndUpdate( _id , req.body).exec()
    res.json(car)

})

carrosControllerV1.delete('/:_id',async function(req,res){

    
    let _id = req.params._id ? req.params._id : false

    if(!isIdValid(_id,res)) return    
    
    if(  _id == false  ) {

       sendError(!_id,res,400,null,"Is not possible to delete a car without id")
       return
    }
    
    Cars.findByIdAndDelete(_id,function(err){

        sendError( err , res , 404 , null , "Error: Was not possible to delete the car!" + err )

        res.status(200).json({
            message:"Car was deleted!"
        })
     })
})

function sendError(err,res , code = 404, end,message){
    if(err){ 
        res.status(code).json({
            error:message + err
        })
        throw( err )
        return end(true)
    }
}
function isIdValid(_id,res){
    if( !mongoose.Types.ObjectId.isValid( _id ) ){
        res.status(400).json({error:"error invalid _id"})
        return false
    }
    else return true

}
module.exports = ( app ) => {
    app.use( router , carrosControllerV1 )
}