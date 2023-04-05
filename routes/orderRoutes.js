const express = require('express')
const {
     getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController')
const authenticateUser = require('../middleware/authentication')
const router = express.Router()


router.get('/',authenticateUser, getAllOrders )
router.get('/:id', authenticateUser, getCurrentUserOrders)
router.get('/:id', authenticateUser,getSingleOrder )
router.post('/', authenticateUser, createOrder)
router.patch("/:id", authenticateUser, updateOrder)

module.exports = router