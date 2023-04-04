const express = require('express')
const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword } = require('../controllers/userController')

router.get('/', getAllUsers)


const router = express.Router()