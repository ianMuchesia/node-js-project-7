const express = require('express')
const { getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,} = require('../controllers/userController')




const router = express.Router()

router.get('/', getAllUsers)

module.exports = router