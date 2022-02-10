// TODO: use single auth file for user & company

const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authMiddleware = async (req, res, next) => {
  // check for token in req.headers
  // add req.user with provided token

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Please provide a token')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // const isCompany = Object.keys(payload).includes('companyId')
    // if (isCompany) {
    //   req.user = { loggedAs: 'company', ...payload }
    // }
    // const isUser = Object.keys(payload).includes('userId')
    // if (isUser) {
    //   req.user = { loggedAs: 'customer', ...payload }
    // }

    req.user = payload
    next()
  } catch (error) {
    console.log(error)
    throw new UnauthenticatedError('Invalid token')
  }
}

// to generate company_id if not provided in req.body
const companyIdGenerate = async (req, res, next) => {
  // grad req.user.companyId
  // add it to req.body
  if (!req.body.company_id) {
    const companyId = req.user.companyId
    req.body = { ...req.body, company_id: companyId }
  }
  next()
}

module.exports = {
  authMiddleware,
  companyIdGenerate,
}
