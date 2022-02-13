const { StatusCodes } = require('http-status-codes')
const UserModel = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')

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
    user: { name: user.name, email: user.email },
    token: token,
  })
}

// user profile
const getProfile = async (req, res) => {
  res.send('user profile')
}

const updateProfile = async (req, res) => {
  res.send('user profile update')
}

const deleteProfile = async (req, res) => {
  res.send('user profile delete')
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
}
