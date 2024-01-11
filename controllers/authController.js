const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// import express-async-handler
// this is a utility function that simplifies error handling in asynchronous 
// express js middleware and route handlers
// asyncHandler will let you not to use try catch block of codes because it will automatically catches error
const asyncHandler = require('express-async-handler')

// @desc login 
// @route POST /auth 
// @access Public 
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // if there is no username / password
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required!' }) // 400 - bad request status
    }

    // if there is username check username from User collection (mongoDB) 
    const foundUser = await User.findOne({ username }).exec()

    // if username does not exist or user is not active from User collection (mongoDB)
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'User is not active or unauthorized!' }) // 401 - unauthorized status
    }

    // if username found from User collection (mongoDB) and is active then 
    // check if password matches using bcrypt compare
    const match = await bcrypt.compare(password, foundUser.password)

    // if password did not match from User collection (mongoDB)
    if (!match) return res.status(401).json({ message: 'Incorrect password!'}) // 401 - unauthorized status

    // if username found from User collection (mongoDB) and is active and
    // password matches from User collection (mongoDB) get access token using jwt sign method
    const accessToken = jwt.sign(
        { // these info will be inserted to encrypted access token
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET, // this is required when issuing a token
        { expiresIn: '15m' } // token will expires after 15 minutes
    )

    // get refresh token using jwt sign method
    const refreshToken = jwt.sign(
        { "username": foundUser.username }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' } // will expires after 7 days
    )

    // create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only by web server 
        secure: true, // https 
        sameSite: 'None', // cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry: set to match RT 
    })

    // send access token containing username & roles to client
    res.json({ accessToken })
})


// @desc get refesh token 
// @route GET /auth/refresh 
// @access Public - because access token has expiration
// this function will issued new access token if the refresh token still not expired
const refresh = (req, res) => {
    // get cookies jwt
    const cookies = req.cookies

    // check if there is no cookies named 'jwt' received
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized!' }) // 401 - unauthorized status

    // if there is jwt cookie then get the refresh token value
    const refreshToken = cookies.jwt

    // verify the refresh token using jwt verify method
    jwt.verify(
        refreshToken, // required
        process.env.REFRESH_TOKEN_SECRET, // required
        asyncHandler(async (err, decoded) => {
            // if jwt verify has failed then it will handle by err variable
            if (err) return res.status(403).json({ message: 'Forbidden!' }) // 403 - forbidden

            // if there's no error, then find user from User collection (mongoDB)
            const foundUser = await User.findOne({ username: decoded.username })

            // if no found user, then set response status to 401 - unauthorized
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized!' }) // 401 - unauthorized

            // if there is user found from mongoDB then request new access token again
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username, 
                        "roles": foundUser.roles
                    }, 
                }, 
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: '15m' }
            )
            
            // send the access token as json to the client
            res.json({ accessToken })

        })
    )

}


// @desc logout
// @route POST /auth/logout 
// @access Public - clear cookie if exists
const logout = (req, res) => {
    // get cookies from client
    const cookies = req.cookies

    // if there's no cookie named jwt then send status 204 - success but no content
    if (!cookies?.jwt) return res.sendStatus(204) // 204 - success but no content

    // if there is cookie then clear cookie named jwt
    res.clearCookie('jwt', {
        httpOnly: true, 
        sameSite: 'None', 
        secure: true
    })

    // send message to client
    res.json({ message: 'Cookie Cleared!' })
}

module.exports = {
    login, 
    refresh, 
    logout
}