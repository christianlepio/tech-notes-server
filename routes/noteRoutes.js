const express = require('express')
const router = express.Router()

router.route('/')
    .get() // fetch notes
    .post() // create new notes
    .patch() // update note
    .delete() // delete note

module.exports = router