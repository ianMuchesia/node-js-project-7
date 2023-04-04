const express = require('express')
const authenticateUser = require('../middleware/authentication')
const {createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,} = require('../controllers/productController')


const router = express.Router()


router.get('/', getAllProducts)
router.get('/:id', getSingleProduct)
router.post('/',authenticateUser, createProduct)
router.patch('/:id', updateProduct)
router.post('/uploadImage', uploadImage)
router.delete('/:id', deleteProduct)


module.exports = router