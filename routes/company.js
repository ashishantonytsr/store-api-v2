const express = require('express')
const router = express.Router()
const { register, login, getProfile, updateProfile, deleteProfile } = require('../controllers/company')

const { authMiddleware } = require('../middlewares/company-auth')

router.post('/auth/register', register)
router.post('/auth/login', login)

router
  .route('/:id')
  .get(authMiddleware, getProfile)
  .patch(authMiddleware, updateProfile)
  .delete(authMiddleware, deleteProfile)

module.exports = router
