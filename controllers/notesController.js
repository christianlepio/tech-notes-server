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

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {

})

// @desc create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    
})

// @desc update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    
})

// @desc delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    
})

// these exports will be used by the noteRoutes js
module.exports = {
    getAllNotes,
    createNewNote,
    updateNote, 
    deleteNote
}