const express = require('express')
const router = express.Router()

const { register, login, getProfile, updateProfile, deleteProfile } = require('../controllers/user')

const { getWishlist, createWishlistItem, deleteWishlistItem } = require('../controllers/wishlist')
const { getCartItems, createCartItem, deleteCartItem } = require('../controllers/cart')

const { authMiddleware } = require('../middlewares/company-auth')

router.post('/auth/register', register)
router.post('/auth/login', login)

// user profile routes
router
  .route('/:id')
  .get(authMiddleware, getProfile)
  .patch(authMiddleware, updateProfile)
  .delete(authMiddleware, deleteProfile)

// user wishlist
router.route('/:id/wishlist').get(authMiddleware, getWishlist).post(authMiddleware, createWishlistItem)
router.route('/:id/wishlist/:itemid').delete(authMiddleware, deleteWishlistItem)

// user cart
router.route('/:id/cart').get(authMiddleware, getCartItems).post(authMiddleware, createCartItem)
router.route('/:id/cart/:itemid').delete(authMiddleware, deleteCartItem)

module.exports = router
