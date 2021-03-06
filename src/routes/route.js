const express = require('express')
const { createCart, getCart, deleteCart, updateCart } = require('../controller/cartController')
const { createOrder, updateOrder } = require('../controller/orderControllers')
const { createProduct, getProductByID, updateProduct, deleteProduct,getProductsByQuery } = require('../controller/productController')
const { createUser, logIn, findProfile, updateProfile } = require('../controller/userControllers')
const { authentication } = require('../middleware/auth')
const router = express.Router()


//feature 1
router.post('/register', createUser)
router.post('/login', logIn)
router.get('/user/:userId/profile', authentication, findProfile)
router.put('/user/:userId/profile', authentication, updateProfile)

//feature 2

router.post('/products', createProduct)
router.get('/products', getProductsByQuery)
router.get('/products/:productId', getProductByID)
router.put('/products/:productId', updateProduct)
router.delete('/products/:productId', deleteProduct)


//feature 3

router.post('/users/:userId/cart',authentication,createCart)
router.get('/users/:userId/cart',authentication ,getCart)
router.put('/users/:userId/cart',authentication ,updateCart)
router.delete('/users/:userId/cart',authentication,deleteCart)


//feature 4
router.post('/users/:userId/orders', authentication,createOrder)
router.put('/users/:userId/orders', authentication,updateOrder)


module.exports = router;
