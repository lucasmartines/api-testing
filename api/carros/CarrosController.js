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

carrosControllerV1.get('/:_id', async(req,res) => {

    
    
    if(!isIdValid( req.params._id , res )) return
    
    
    try{
        let carro = await Cars.findById( req.params._id )
        console.log("____________",carro)

        if(carro == null){
            
            return res.status(404).send({message:"Erro Carro não encontrado"})
        }
        

        res.json( carro )
        
    }
    catch( e ){
        return sendError(true,res,500,null,"Fail to connect with database")
    }
})


carrosControllerV1.post('/',async function(req,res){

    let _cars

    try{
        _cars = await Cars.create(req.body)
    }
    catch (e) {
        return res.status(400).send( { error : "Error: Is not possible to get a car list!"+ e  } )
    }

    res.status(201).json( _cars )
})

carrosControllerV1.put('/:_id',async function(req,res){


    // if not exists id send error
    let _id = req.params._id ? req.params._id : _sendErrorIdFalseOrNull(false,res)

    // if is not valid send error 
    if( !isIdValid(_id,res)) return  

    Cars.findById(_id , async function(err ,car){
        // if no exists a car send 404 error
        if( !car ){
            res.status(404).json({error:"Error: The car not exists"})           
        }

        // if exist a car then update
        try{
            let car = await Cars.findByIdAndUpdate( _id , req.body).exec()
            res.json(car)
        }
        catch(e){
            sendError(false,res,404,null,"Error: Is not possible to update a car")
        }
    })

})

carrosControllerV1.delete('/:_id',async function(req,res){
    
    let _id = req.params._id ? req.params._id : _sendErrorIdFalseOrNull(false,res)
    
    if(!isIdValid(_id,res)) return    
    
    Cars.findByIdAndDelete(_id,function(err){

        sendError( err , res , 404 , null , "Error: Was not possible to delete the car!" + err )

        res.status(200).json({
            message:"Car was deleted!"
        })
    })
})

function _sendErrorIdFalseOrNull(_id = false,res,msg = 'delete'){
    sendError(!_id,res,400,null,"Error: Is not possible to " + msg + " a car without id")
    return
}
/**
 * Maibe i consider transform it in a promise
 * @param {*} err Err is an boolean that if is true show error
 * @param {*} res is the response object
 * @param {*} code is the code of response in http
 * @param {*} end is a callback when it ends
 * @param {*} message is your message that wil go to user
 */
function sendError(err,res , code = 404, end = null ,message){
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