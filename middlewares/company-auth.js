// TODO: use single auth file for user & company

const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const CompanyModel = require('../models/Company')
const UserModel = require('../models/User')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Please provide a token')
  }
  const token = authHeader.split(' ')[1]

  let payload = {}
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    // TODO: remove clg & update error msg
    console.log(error)
    throw new UnauthenticatedError('Invalid token')
  }

  // check if company/user exists
  if (payload.companyId) {
    const company = await CompanyModel.findById(payload.companyId)
    if (!company) {
      throw new UnauthenticatedError('Please log in as valid company')
    }
  }

  if (payload.userId) {
    const user = await UserModel.findById(payload.userId)
    if (!user) {
      throw new UnauthenticatedError('Please log in as valid user')
    }
  }

  req.user = payload
  next()
}

// to generate company_id if not provided in req.body
const companyIdGenerate = async (req, res, next) => {
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
