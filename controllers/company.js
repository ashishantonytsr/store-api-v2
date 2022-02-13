const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('../errors')
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
  if (req.user.companyId != req.params.id) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  const company = await CompanyModel.find({ _id: req.params.id }).select(
    '-password'
  )
  if (!company || company == '') {
    throw new NotFoundError('Company not found')
  }
  res.status(StatusCodes.OK).json({ success: true, data: company })
}

const updateProfile = async (req, res) => {
  if (req.user.companyId != req.params.id) {
    throw new UnauthenticatedError('Unauthorized to access this route')
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
    queryObj.name = name
  }

  if (email) {
    // if duplicate email found, mongoose throw error
    queryObj.email = email
  }

  if (contact_number) {
    // if duplicate contact_number found, mongoose throw error
    queryObj.contact_number = contact_number
  }

  if (address) {
    queryObj.address = address
  }

  const company = await CompanyModel.findOneAndUpdate(
    { _id: req.params.id },
    queryObj,
    { new: true, runValidators: true }
  ).select('-password')

  if (!company || company == '') {
    throw new NotFoundError('Company not found')
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: `Company updated successfully`, data: company })
}

const deleteProfile = async (req, res) => {
  if (req.user.companyId != req.params.id) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }

  const company = await CompanyModel.findByIdAndDelete(req.params.id)
  if (!company || company == '') {
    throw new NotFoundError('Company not found')
  }
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
