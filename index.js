// must be first 
require('dotenv').config()

// config
    // default config for env
    process.env.NODE_ENV = (!process.env.NODE_ENV) ? 'development' : process.env.NODE_ENV

// start app
    const app = require('./app.js')

// configure port and host
    let port = process.env.port || 3000
    let host = !process.env.HOST ? 'localhost' : process.env.HOST


// app.listen( port,HOST, () => {
//     console.log("Server Running At " + port )
// })

app.listen(port,host,0, ()=>console.log(`SERVER RUNNING AT:  ${host}:${port}`))