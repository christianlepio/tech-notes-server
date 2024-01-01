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
    // this will select all users & fields except for the password field
    // with lean() method, mongoose will send data that has no extra functions like save document and 
    // others it will send json data that has no extra functions/methods included
    const users = await User.find().select('-password').lean()

    if (!users) {
        return res.status(400).json({ message: 'No Users found!' })
    }
    // send users as a response if there are selected users.
    res.json(users)
})

// @desc create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {

})

// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {

})

// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {

})

// these exports will be used by the userRoutes js
module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}