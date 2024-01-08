const express = require('express')
const router = express.Router()
// import auth controller for login
const authController = require('../controllers/authController')
// import login limiter to avoid many login request per minute
const loginLimiter = require('../middleware/loginLimiter')

// this is the root/index route of '/auth' route
router.route('/')
    .post(loginLimiter, authController.login) // login route

// route to get request for refresh token of '/auth' route
router.route('/refresh')
    .get(authController.refresh)

// route to logout of '/auth' route
router.route('/logout')
    .post(authController.logout)

module.exports = router