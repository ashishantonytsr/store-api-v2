const { StatusCodes } = require('http-status-codes')
const { CustomAPIError } = require('../errors')

const errorHandlerMiddleware = async (err, req, res, next) => {
  let errorObj = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong.. Try later...',
  }

  // duplicate email error
  if (err.code && err.code == 11000) {
    errorObj.statusCode = StatusCodes.BAD_REQUEST
    errorObj.msg = `Email '${Object.values(
      err.keyValue
    )}' is already registered`
  }

  // validation error
  if (err.name === 'ValidationError') {
    const fields = Object.keys(err.errors)
    console.log(fields)
    errorObj.statusCode = StatusCodes.BAD_REQUEST
    errorObj.msg = `Please provide ${fields}`
  }

  return res
    .status(errorObj.statusCode)
    .json({ success: false, msg: errorObj.msg, errObj: err })
}

module.exports = errorHandlerMiddleware
