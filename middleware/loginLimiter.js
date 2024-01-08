const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
    // below are options for rate limit
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per 'window' per minute
    message: { message: 'Too many login attempts from this IP, please try again after a minute pause' }, 
    // if the login attempt limit has achieved then log the error message to errLog file
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        // send the status code with message attached
        res.status(options.statusCode).send(options.message)
    },
    // this is recommended options
    standardHeaders: true, // return rate limit info in the 'RateLimit-*' headers 
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
})

module.exports = loginLimiter