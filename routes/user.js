const express = require('express')
const router = express.Router()
const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/user')

router.post('/auth/register', register)
router.post('/auth/login', login)

// user profile routes
router.route('/:id').get(getProfile).patch(updateProfile).delete(deleteProfile)

// user wishlist
router.route('/:id/wishlist').get((req, res) => {
  res.send('user wishlist route')
})

// user cart
router.route('/:id/cart').get((req, res) => {
  res.send('user cart route')
})

module.exports = router
