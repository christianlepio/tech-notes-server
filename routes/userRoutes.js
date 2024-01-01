const express = require('express')
const router = express.Router()
// import user controller 
const usersController = require('../controllers/usersController')

// this is the index route of '/users' route
router.route('/')
    .get(usersController.getAllUsers) // read user
    .post(usersController.createNewUser) // create user
    .patch(usersController.updateUser) // update user
    .delete(usersController.deleteUser) // delete user

module.exports = router