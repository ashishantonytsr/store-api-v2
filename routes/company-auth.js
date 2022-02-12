// TODO: use one file for authentication; both from user side & company side

const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/company-auth')

router.post('/register', register)
router.post('/login', login)

module.exports = router
