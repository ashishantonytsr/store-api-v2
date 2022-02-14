const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const ProductModel = require('../models/Product')
const CartModel = require('../models/Cart')

const getCartItems = async (req, res) => {
  res.send('get cart')
}

const createCartItem = async (req, res) => {
  res.send('update cart')
}

const deleteCartItem = async (req, res) => {
  res.send('delete cart')
}

module.exports = {
  getCartItems,
  createCartItem,
  deleteCartItem,
}
