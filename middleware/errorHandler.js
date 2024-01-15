// import logEvents function from logger custom middleware
const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    // call function logEvents here and pass in the message and filename for logging the error
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(`errorLog: ${err.stack}`)

    // define the status
    const status = res.statusCode ? res.statusCode : 500 // 500 is a server error
    // set the response status
    res.status(status)
    // send the response in json format
    // send isError indicator with a value of true because rtk query is expecting this
    res.json({ message: err.message, isError: true })
}

module.exports = errorHandler