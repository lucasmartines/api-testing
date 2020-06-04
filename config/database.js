const mongoose = require('mongoose')

const config = {
    useNewUrlParser: true,
}


// mongoose for local
let URL_CONNECTION = process.env.DB_URL || 'mongodb://localhost/carrosApiLocal' 

/**
 * ## set the url of database to url in env, so i can teste the database
 */
if( /test/i.test( process.env.NODE_ENV ) ){
    URL_CONNECTION = process.env.DATABASE_URL_TEST

    console.log('___TESTING MODE IN DATABASE____')
    console.log('__URL CONNECTION: ',URL_CONNECTION)
}

try{
    mongoose.connect( URL_CONNECTION , config )
    console.log("mongoose is online")
}
catch(e){
    console.log("Error with mongoose" + e )
}

module.exports = mongoose