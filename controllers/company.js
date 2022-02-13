const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const CompanyModel = require('../models/Company')
const ProductModel = require('../models/Product')

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

// company profile routes
const getProfile = async (req, res) => {
  if (!req.user.companyId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.companyId != req.params.id) {
    throw new NotFoundError('Invalid company id')
  }
  const company = await CompanyModel.findOne({ _id: req.params.id }).select('-password')

  res.status(StatusCodes.OK).json({ success: true, data: company })
}

const updateProfile = async (req, res) => {
  if (!req.user.companyId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.companyId != req.params.id) {
    throw new NotFoundError('Invalid company id')
  }

  // TODO: update route to update password
  const { name, email, contact_number, address } = req.body
  const queryObj = {}
  if (name == '' || email == '' || contact_number == '' || address == '') {
    throw new BadRequestError('Please provide valid values')
  }
  if (name) {
    const isDuplicate = await CompanyModel.find({ name })
    if (isDuplicate) {
      throw new BadRequestError(`Company with name '${name}' already exists`)
    }
  }

  const company = await CompanyModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, email, contact_number, address },
    { new: true, runValidators: true }
  ).select('-password')

  res.status(StatusCodes.OK).json({ success: true, msg: `Company updated successfully`, data: company })
}

const deleteProfile = async (req, res) => {
  if (!req.user.companyId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.companyId != req.params.id) {
    throw new NotFoundError('Invalid company id')
  }

  const company = await CompanyModel.findByIdAndDelete(req.params.id)
  const products = await ProductModel.deleteMany({ company_id: req.params.id })

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Company deleted successfully`,
    deletedCount: products.deletedCount,
  })
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
}
