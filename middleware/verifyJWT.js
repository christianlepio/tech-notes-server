const jwt = require('jsonwebtoken')

// middleware function
const verifyJWT = (req, res, next) => {
    // get auth header access token
    const authHeader = req.headers.authorization || req.headers.Authorization
    console.log('authHeader: ', authHeader)

    // check if auth header access token starts with the word 'Bearer '
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized!' }) // 401 - unauthorized status
    }

    // if access token starts with 'Bearer ', then get the access token 
    const token = authHeader.split(' ')[1]

    // check if access token still not expired using jwt verify method
    jwt.verify(
        token, // access token - required
        process.env.ACCESS_TOKEN_SECRET, // required
        (err, decoded) => {
            // if there's error on verification
            if (err) return res.status(403).json({ message: 'Forbidden!' }) // 403 - forbidden

            // if there's no error, get username & roles from decoded UserInfo
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles

            // this will allow to move on the next middleware or controller
            next()
        }
    )
}

module.exports = verifyJWT