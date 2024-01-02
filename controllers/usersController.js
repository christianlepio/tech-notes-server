// import data models
const User = require('../models/User')
const Note = require('../models/Note')
// import express-async-handler
// this is a utility function that simplifies error handling in asynchronous 
// express js middleware and route handlers
// asyncHandler will let you not to use try catch block of codes because it will automatically catches error
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

    if (!users?.length) {
        return res.status(400).json({ message: 'No Users found!' }) // 400 bad request
    }
    // send users as a response if there are selected users.
    res.json(users)
})

// @desc create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    // get data from request body by destructuring
    const { username, password, roles } = req.body

    // confirm data 
                                // if roles is not an array
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required!' }) // 400 bad request
    }

    // check for username duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Username already exist!' }) // 409 conflict
    }

    // if data was confirmed and has no duplicated username
    // encrypt the password using bcrypt
    const hashedPwd = await bcrypt.hash(password, 10) // 10 is a default salt rounds for password hashing

    // define user object to be passed in the database
    const userObj = { username, 'password': hashedPwd, roles }

    // create and store new user to the database (mongoDB)
    const user = await User.create(userObj)

    if (user) { // user was successfully created
        res.status(201).json({ message: `New User ${username} created!` })
    } else {
        res.status(400).json({ message: 'Invalid received user data!' }) // 400 bad request
    }
})

// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    // get data from request body by destructuring
    const { id, username, roles, active, password } = req.body

    // confirm data
                                        // if roles is not an array             & data type of active is not a boolean
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required!' }) // 400 bad request
    }

    // if data was confirmed
    // find user by id, exec() method means it will attach other methods to the response document such as save() method
    const user = await User.findById(id).exec()

    // if no user found
    if (!user) {
        return res.status(400).json({ message: 'No users found!' }) // 400 bad request
    }

    // if there is user found then check for duplicated username
    const duplicate = await User.findOne({ username }).lean().exec()

    // allow updates to its target user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exist!' }) // 409 conflict
    }

    // if there is no duplicated username then update the user data
    user.username = username
    user.roles = roles
    user.active = active

    // if the user changes the password then change the user password
    if (password) {
        // encrypt the password using bcrypt
        user.password = await bcrypt.hash(password, 10) // 10 is a default salt rounds for password hashing
    }

    // save updated user data to database (mongoDB)
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated!` })
})

// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    // get id from request body by destructuring
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'id property is missing!' }) // 400 bad request
    }

    // check for notes collection 1st, do not delete a user that has an assigned notes
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes!' }) // 400 bad request
    }

    // if user has no assigned notes then find the user in the database that is going to be deleted
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User does not exist!' }) // 400 bad request
    }

    // if there is user found then delete that user data
    const result = await user.deleteOne()
    console.log('userDelete result: ', result)
    // reply message after deleting a user data
    const reply = `Username: ${user.username} with ID: ${user._id} deleted!`

    res.json(reply)

})

// these exports will be used by the userRoutes js
module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}