const { format } = require('date-fns')
// rename v4 to uuid, this will generate unique ids
const { v4: uuid } = require('uuid')
const fs = require('fs') // file system
const fsPromises = require('fs').promises // allows to use async function in file system
const path = require('path')

//helper function to log the events of the user
const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        // directory does not exist  
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            // make logs folder dir
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        } else {
            // if does exist
            // append logItem to logFileName
            await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
        }
    } catch (err) {
        console.log(err)
    }
}

// actual middleware
const logger = (req, res, next) => {
    // pass in the message and filename to logEvents function
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method}\t${req.path}`)
    // this will move on to the next piece of middleware or probably to the controller
    next()
}

module.exports = { logEvents, logger }