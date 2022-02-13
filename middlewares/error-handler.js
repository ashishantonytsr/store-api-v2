const { StatusCodes } = require('http-status-codes')
const { CustomAPIError } = require('../errors')

const errorHandlerMiddleware = async (err, req, res, next) => {
  let errorObj = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong.. Try later...',
  }

  // duplication error
  if (err.code && err.code == 11000) {
    const field = Object.keys(err.keyValue)
    const value = Object.values(err.keyValue)
    errorObj.statusCode = StatusCodes.BAD_REQUEST
    errorObj.msg = `'${field}' '${value}' is already registered`
  }

  // validation error
  // TODO: deal with regex exp error spit
  if (err.name === 'ValidationError') {
    const fields = Object.keys(err.errors)
    errorObj.statusCode = StatusCodes.BAD_REQUEST
    errorObj.msg = `Please provide ${fields}`
  }

  // TODO: include cast errors
  if (err.name == 'CastError') {
    errorObj.statusCode = StatusCodes.BAD_REQUEST
    errorObj.msg = `Please provide valid ${err.path}`
  }

  // TODO: remove errorObj from res in production
  return res.status(errorObj.statusCode).json({ success: false, msg: errorObj.msg, errObj: err })
}

module.exports = errorHandlerMiddleware
