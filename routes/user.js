const express = require('express')
const router = express.Router()

const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/user')

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
router
  .route('/:id/wishlist')
  .get((req, res) => {
    res.send('user get wishlist')
  })
  .post((req, res) => {
    res.send('user add wishlist')
  })

router.route('/:id/wishlist/:itemid').delete((req, res) => {
  res.send('user delete wishlist')
})

// user cart
router
  .route('/:id/cart')
  .get((req, res) => {
    res.send('user get cart')
  })
  .post((req, res) => {
    res.send('user add cart')
  })

router.route('/:id/cart/:itemid').delete((req, res) => {
  res.send('user delete cart')
})

module.exports = router
