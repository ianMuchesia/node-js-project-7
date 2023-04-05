const express = require('express')
const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview ,getSingleProductReviews} = require('../controllers/reviewController')
const authenticateUser = require('../middleware/authentication')
const router = express.Router()


router.get('/:id', getSingleReview)
router.get('/', getAllReviews)
router.post('/',authenticateUser, createReview )
router.patch('/:id',authenticateUser, updateReview )
router.delete('/:id',authenticateUser, deleteReview )

module.exports = router
