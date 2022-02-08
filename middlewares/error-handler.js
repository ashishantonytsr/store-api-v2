const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('../errors')

const errorHandlerMiddleware = async (err, req, res, next)=>{
	let errorObj = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong.. Try later...'
	}
	return res.status(errorObj.statusCode).json({ success: false, msg: errorObj.msg })
}

module.exports = errorHandlerMiddleware