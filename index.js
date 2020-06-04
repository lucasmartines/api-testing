const express = require('express')

// load all config: like database and dotenv config
require('./config')

const app = express()

require('./config/middleware')(app)

// LOAD ALL SERVICES
require('./api/carros/CarrosController')(app)


let PORT

if( /test/i.test( process.env.NODE_ENV ) ){
    PORT = 9999
}else{
    PORT = process.env.PORT || 3000
}

app.listen( PORT, () => {
    console.log("Server Running At " + PORT )
})

module.exports = app