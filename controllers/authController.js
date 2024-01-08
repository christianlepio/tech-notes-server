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
    // do stuff here
})


// @desc get refesh token 
// @route GET /auth/refresh 
// @access Public - because access token has expiration
const refresh = (req, res) => {
    // do stuff here
}


// @desc logout
// @route POST /auth/logout 
// @access Public - clear cookie if exists
const logout = (req, res) => {
    // do stuff here
}

module.exports = {
    login, 
    refresh, 
    logout
}