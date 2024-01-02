// import data models
const User = require('../models/User')
const Note = require('../models/Note')
// import express-async-handler
// this is a utility function that simplifies error handling in asynchronous 
// express js middleware and route handlers
// asyncHandler will let you not to use try catch block of codes because it will automatically catches error
const asyncHandler = require('express-async-handler')

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    // this will select all notes from techNotesDB/notes (mongoDB) collection
    // with lean() method, mongoose will send data that has no extra functions like save document and 
    // others, it will only send data that has no extra functions/methods included
    const notes = await Note.find().lean()

    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found in the DB!' }) // 400 - bad request
    }

    // if there is/are notes found, add designated username each note before sending as response to client
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        // find user by id, note.user is holding a value for user id
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    // send notes with username response to the client 
    res.json(notesWithUser)
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