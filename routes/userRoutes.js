const express = require('express')
const router = express.Router()

// this is the index route of '/users' route
router.route('/')
    .get() // read user
    .post() // create user
    .patch() // update user
    .delete() // delete user

module.exports = router