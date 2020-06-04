const bodyParser = require('body-parser')
const express = require('express')




/**
 * Espera deceber o app para integrar ele com os middlewares
 * it expects receive app to integrate it with middlewares
 */
module.exports = (app) => 
{
    app.use( bodyParser.json() )
    express.urlencoded({extended:false})
}