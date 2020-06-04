// must be first 
require('dotenv').config()



const app = require('./app.js')

let PORT = process.env.PORT || 3000

app.listen( PORT, () => {
    console.log("Server Running At " + PORT )
})

