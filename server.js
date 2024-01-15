// import dotenv to allow the code to use the environment variables
require('dotenv').config()
// this is an alternative for const asyncHandler = require('express-async-handler')
// this will automatically catch errors even when u don't use try catch
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
// import logger, logEvents to log the requests of a user
const { logger, logEvents } = require('./middleware/logger')
// import error handler to log in error.log file
const errorHandler = require('./middleware/errorHandler')
// import cookie-parser
const cookieParser = require('cookie-parser')
// import Cross-Origin Resource Sharing
const cors = require('cors')
// import cors options to attach in cors 3rd party middleware
const corsOptions = require('./config/corsOptions')
// import connectDB function
const connectDB = require('./config/dbConn')
// import mongoose
const mongoose = require('mongoose')

// define PORT
const PORT = process.env.PORT || 3500 

// pull out env variables (only for testing)
console.log('NODE_ENV: ', process.env.NODE_ENV)

// connect to mongoDB
connectDB()

// use logger function from start of request
// this is a custom middleware
app.use(logger)

// implement 3rd party middleware
// Cross Origin Resource Sharing (CORS)
app.use(cors(corsOptions))

// ability to process JSON (built in middleware)
// this will let the app recieve and parse .json data
app.use(express.json())

// implement 3rd party middleware (cookie-parser)
app.use(cookieParser())

// listen for the root route ('/')
// serve static files such as css, images, etc.
// dirname here is the file path of this server.js
// express.static() is a built in middleware
app.use('/', express.static(path.join(__dirname, 'public')))

// index route
// requesting for index page
app.use('/', require('./routes/root'))
// route endpoint for login (auth route)
app.use('/auth', require('./routes/authRoutes'))
// route endpoint for requesting users
app.use('/users', require('./routes/userRoutes'))
// route endpoint for requesting notes
app.use('/notes', require('./routes/noteRoutes'))

// catch 404 page not found
app.all('*', (req, res) => {
    // set the status to 404
    res.status(404)
    
    if (req.accepts('html')) {
        // if the request header accepts html
        console.log('404 request header accepts html')
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts()) {
        // if the request header accepts json
        console.log('404 request header accepts json')
        res.json({ message: '404 not found' })
    } else {
        res.type('txt').send('404 not found')
    }
})

// use error handler function here to log in error.log
// this is a custom middleware
app.use(errorHandler)

// listen for the connected event of mongoose
// listen for this event once
// listen for the event open, meaning if app success to connect to mongoDB
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')

    // listen to the app once mongoDB connection success
    // web creates a server that listens on port you define on your computer
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

// one other listener
// this will listen for an error with the mongoDB connection
mongoose.connection.on('error', err => {
    console.log('MongoDB connection error: ', err)

    // log the mongoDB connection error to file mongoErrLog.log
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})