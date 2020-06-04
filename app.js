const express = require('express')


// load all config: like database and dotenv config
const app = express()

// DATABASE
require('./config/database')
require('./config/middleware')(app)

// LOAD ALL SERVICES
require('./api/carros/CarrosController')(app)


module.exports = app