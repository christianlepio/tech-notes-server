const express = require('express')
const router = express.Router()
// import notes controller
const notesController = require('../controllers/notesController')
// middleware to verify JWT access token
const verifyJWT = require('../middleware/verifyJWT')

// check if access token exist and not expired before performing controllers below
router.use(verifyJWT)

// this is the index route of '/notes' route
router.route('/')
    .get(notesController.getAllNotes) // fetch notes
    .post(notesController.createNewNote) // create new notes
    .patch(notesController.updateNote) // update note
    .delete(notesController.deleteNote) // delete note

module.exports = router