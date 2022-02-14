const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const UserModel = require('../models/User')

const register = async (req, res) => {
  // Validation is done by mongoose at the time of insertion
  const user = await UserModel.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: `User successfully registered`,
    user: { name: user.name, email: user.email },
    token: token,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  // find user with email
  const user = await UserModel.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError(`No account found with email '${email}'`)
  }

  // compare password; returns boolean
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password does not match')
  }

  // create token
  const token = await user.createJWT()

  // respond
  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Successfully logged in`,
    user: { user_id: user._id, name: user.name, email: user.email },
    token: token,
  })
}

// user profile
const getProfile = async (req, res) => {
  if (!req.user.userId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.userId != req.params.id) {
    throw new NotFoundError('Invalid user id')
  }

  const user = await UserModel.findOne({ _id: req.params.id }).select('-password -wishlist -cart')

  res.status(StatusCodes.OK).json({ success: true, data: user })
}

const updateProfile = async (req, res) => {
  if (!req.user.userId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.userId != req.params.id) {
    throw new NotFoundError('Invalid user id')
  }

  const { name, email, contact_number, address } = req.body
  if (name == '' || email == '' || contact_number == '' || address == '') {
    throw new BadRequestError('Please provide valid values')
  }
  const user = await UserModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, email, contact_number, address },
    { new: true, runValidators: true }
  ).select('-password')

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `User updated successfully`,
    data: user,
  })
}

const deleteProfile = async (req, res) => {
  if (!req.user.userId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.userId != req.params.id) {
    throw new NotFoundError('Invalid user id')
  }

  const user = await UserModel.findByIdAndDelete(req.params.id)

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `User deleted successfully`,
  })
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
}
