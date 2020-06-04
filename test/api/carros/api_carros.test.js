// i dont know why dotenv dont start by itself in app.js in test mode
// so i force it to reload here berore reloading all
require('dotenv').config()


const request = require('supertest')
const app = require('../../../app')
const URL_TEMPLATE = '/api/v1/carros'
const mongoose = require('mongoose')


const Car = require('../../../models/carsModel')

const resetDatabase = async () => {
    await Car.deleteMany().exec()
}

const car_generator = async () => {
    return await Car.create({
        name: "Carro Legal"
    })
}

beforeEach(async ()=>{

    await resetDatabase()
})

afterAll(async()=>{

    await resetDatabase()
    mongoose.connection.close()
    
})


describe('Test of route[GET]: /api/v1/carros ', function( ) 
{

    it('shoud return a list of 2 cars', async function(){

        await car_generator()
        await car_generator()
        
        const res = await request( app )
            .get(URL_TEMPLATE)
            .expect('Content-Type',/json/)
            .expect(200)
            
        let qtd_cars = res.body.length;

        expect(qtd_cars).toEqual(2)
    })
    it('endpoint /api/v1/carros must be online and return 200', async function(){

        const res = await request( app ).get( URL_TEMPLATE )
        expect(res.statusCode).toEqual(200)
    })

    it('endpoint /api/v1/carros must be returned in json', async function(){

        const res = await request( app )
            .get( URL_TEMPLATE )
            .set('Accept', 'application/json')
            .expect('Content-Type',/json/)
            .expect(200) 

    })

    it('shoud post to endpoint /api/v1/carros', async () => {

        const res = await request( app )
              .post( URL_TEMPLATE )
              .send({
                 name:"Super Carro Legal"
              })
              .expect('Content-Type',/json/)
              .expect(201)

    })
})

describe('Testing [POST] /api/v1/carros',()=>{


    it('shoud return error if user dont send name in object', async () => {
        
        const res = await request( app )
              .post( URL_TEMPLATE )
              .send({ })
              .expect('Content-Type',/json/)
              .expect(400)
        
        expect(res.error).toBeTruthy()
    })

    it('shoud return error if user dont send name in object or send undefined', async () => {
        
        const res = await request( app )
              .post( URL_TEMPLATE )
              .send(undefined)
              .expect('Content-Type',/json/)
              .expect(400)
        expect(res.error).toBeTruthy()
    })

    it('shoud receive 201 status', async()=>{

        await request( app )
            .post( URL_TEMPLATE )
            .send({
                name:"Super Carro Legal"
            })
            .expect('Content-Type',/json/)
            .expect(201)

    })
    it('shoud receive the user that has been sent, with the post on /api/v1/carros', async()=>{
        
        const {text,statusCode} = await request(app)
                .post( URL_TEMPLATE )
                .send({
                    name:"Carro Legal"
                })
        
        const { error, name } = JSON.parse(text)

        expect(error).toBeFalsy()
        expect(name).toEqual("Carro Legal")

    })

    it('shoud register user in database, and check if he exists', async()=>{
       
        await request(app)
            .post( URL_TEMPLATE )
            .send({
                name:"Carro Legal"
            })
        
        let car = await Car.find().exec()
        expect(car.length).toBeGreaterThan(0)

    })

    it('should return 404 if user try to update a object that does not exists', async()=>{
        const mongoose = require('mongoose')
        let valid_id = mongoose.Types.ObjectId()

        await request(app)
            .put( `${URL_TEMPLATE}/${valid_id}` )
            .send({
                name:"Carro Legal"
            }).expect(404)

    })

})

describe('Testing [DELETE]',()=>{

    
    it(`shoud expect 200 when deleting a car route ${URL_TEMPLATE}/[param_id]`,async()=>{

        let car1 = await car_generator()

        await request(app)
            .delete( `${URL_TEMPLATE}/${car1._id}` )
            .expect('Content-Type',/json/)
            .expect(200)
    })

    it(`shoud send error if user send invalid parameter: ${URL_TEMPLATE}`,async()=>{

        let {error} = await request(app)
            .delete(URL_TEMPLATE + "/1234" )
            .expect(400)
        
        expect(error).toBeTruthy()
    })


    it('should check if car in database is deleted', async () => {
        
        let car1 = await car_generator()

        await request(app)
            .delete( `${URL_TEMPLATE}/${car1._id}` )
            .expect(200)
        
        let carsInDb = await Car.count() 

        expect(carsInDb).toEqual(0)
    })    
})

describe('Testing [PUT] request',()=>{

    
    it('shoud update car by passing some params to body',async function(){
        
        let car1 = await car_generator()
        
        await request(app)
            .put(`${URL_TEMPLATE}/${car1._id}`)
            .expect('Content-Type',/json/)
            .send({
                name:"Carro Bacana"
            })
        
        let find_car = await Car.find({name:"Carro Bacana"}).exec()
        expect(find_car[0].name).toEqual("Carro Bacana")

    })

    it('should return 400 error with passing invalid id', async() => {
        await request(app)
            .put(`${URL_TEMPLATE}/invalid-param`)
            .send({
                name:"Carro Bacana"
            })
            .expect(400)

    })

    it('should return 400 if user pass null or false',async()=>{
        await request(app)
            .put(`${URL_TEMPLATE}/false`)
            .send({
                name:"Carro Bacana"
            })
            .expect(400)

    })

    it('should return 400 if user pass null or false',async()=>{

        await request(app)
            .put(`${URL_TEMPLATE}/null`)
            .send({
                name:"Carro Bacana"
            })
            .expect(400)


    })


})