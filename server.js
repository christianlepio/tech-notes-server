const express = require('express')
const app = express()
const path = require('path')
// import logger to log the requests of a user
const { logger } = require('./middleware/logger')
// import error handler to log in error.log file
const errorHandler = require('./middleware/errorHandler')
// import cookie-parser
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3500 

// use logger function from start of request
// this is a custom middleware
app.use(logger)

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))