const mongoose = require('mongoose')

const config = {
    useNewUrlParser: true,
}

// mongoose for local
let URL_CONNECTION = process.env.DB_URL || 'mongodb://localhost/carrosApiLocal' 

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

/**
 * ## set the url of database to url in env, so i can teste the database
 */
if( /test/i.test( process.env.NODE_ENV ) )
{
    URL_CONNECTION = process.env.DATABASE_URL_TEST || URL_CONNECTION
    console.log('__________TESTING MODE IN DATABASE____________')
}

/**
 * if production
 */
if(/prod/i.test(process.env.NODE_ENV)){
    URL_CONNECTION = process.env.DATABASE_URL_PRODUCTION || URL_CONNECTION
    console.log('__URL DATABASE CONNECTION: ', URL_CONNECTION   )
}


try{
    mongoose.connect( URL_CONNECTION , config )
    console.log("____________mongoose is online______________")
}
catch(e){
    console.log("Error with mongoose: " + e )
}

module.exports = mongoose