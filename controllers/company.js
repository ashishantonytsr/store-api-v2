const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('../errors')
const CompanyModel = require('../models/Company')

const register = async (req, res) => {
  const company = await CompanyModel.create({ ...req.body })
  const token = company.createJWT()

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: `Company succesfully registered`,
    user: { name: company.name, email: company.email },
    token,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email & password')
  }

  const company = await CompanyModel.findOne({ email })
  if (!company) {
    throw new NotFoundError(`No account found with email '${email}'`)
  }

  // comparing password
  const isPasswordCorrect = await company.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password does not match')
  }

  // creating token
  const token = company.createJWT()
  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Successfully logged in`,
    user: { name: company.name, email: company.email },
    token,
  })
}

// company profile
const getProfile = async (req, res) => {
  if (req.user.companyId != req.params.id) {
    throw new UnauthenticatedError('Unauthorized to view company')
  }
  const company = await CompanyModel.find({ _id: req.params.id }).select(
    '-password'
  )
  res.status(StatusCodes.OK).json({ success: true, data: company })
}

const updateProfile = async (req, res) => {
  res.send('company profile update')
}

const deleteProfile = async (req, res) => {
  res.send('company profile delete')
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
}