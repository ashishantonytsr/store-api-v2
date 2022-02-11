const { StatusCodes } = require('http-status-codes')
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
  res.send('customer login router')
}

module.exports = {
  register,
  login,
}
