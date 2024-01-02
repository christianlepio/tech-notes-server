const express = require('express')
const router = express.Router()

// this is the index route of '/notes' route
router.route('/')
    .get() // fetch notes
    .post() // create new notes
    .patch() // update note
    .delete() // delete note

module.exports = router