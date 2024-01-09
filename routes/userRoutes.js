const express = require('express')
const router = express.Router()
// import user controller 
const usersController = require('../controllers/usersController')
// middleware to verify JWT access token
const verifyJWT = require('../middleware/verifyJWT')

// check if access token exist and not expired before performing controllers below
router.use(verifyJWT)

// this is the index route of '/users' route
router.route('/')
    .get(usersController.getAllUsers) // read user
    .post(usersController.createNewUser) // create user
    .patch(usersController.updateUser) // update user
    .delete(usersController.deleteUser) // delete user

module.exports = router