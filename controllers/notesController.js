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
    // get data from request body by destructuring
    const { user, title, text } = req.body

    // confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required!' }) // 400 - bad request
    }

    // if data was confirmed, check for note's title duplicates
    const duplicated = await Note.findOne({ title }).lean().exec()
    if (duplicated) {
        return res.status(409).json({ message: "Note's title already exists!" }) // 409 - conflict
    }

    // if there is no duplicated note's title then create new note and store to techNotesDB/notes collection (mongoDB)
    const note = await Note.create({ user, title, text })

    if (note) { // note was successfully created
        res.status(201).json({ message: `New note ${title} created!` }) 
    } else {
        res.status(400).json({ message: "Invalid received note's data!" }) // 400 - bad request
    }
})

// @desc update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    // get data from request body by destructuring
    const { id, user, title, text, completed } = req.body

    // confirm data
                                        // check if completed data type is boolean
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required!' }) // 400 - bad request
    }

    // if data was confirmed, find that specific note from DB
    // exec() method means it will attach other methods to the response document such as save() method
    const note = await Note.findById(id).exec()

    // check if there is no notes found
    if (!note) {
        return res.status(400).json({ message: 'No notes found!' }) // 400 - bad request
    }

    // if there is note found, check for duplicated note's title
    const duplicated = await Note.findOne({ title }).lean().exec()

    // this will allow updates to its target note
    if (duplicated && duplicated?._id.toString() !== id) {
        return res.status(409).json({ message: "Note's title already exist!" }) // 409 - conflict
    }

    // if there is no duplicated note's title then update note's data
    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    // save updated note's data to mongoDB (techNotesDB/notes)
    const updatedNote = await note.save()

    res.json({ message: `${updatedNote.title} updated!` })
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