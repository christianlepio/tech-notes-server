// import data models
const User = require('../models/User')
const Note = require('../models/Note')
// import express-async-handler
// this is a utility function that simplifies error handling in asynchronous 
// express js middleware and route handlers
const asyncHandler = require('express-async-handler')
// import bcrypt to encrypt password value
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    
})
