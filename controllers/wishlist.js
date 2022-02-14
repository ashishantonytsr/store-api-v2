const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const ProductModel = require('../models/Product')
const WishlistModel = require('../models/Wishlist')

const getWishlist = async (req, res) => {
  if (!req.user.userId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.userId != req.params.id) {
    throw new NotFoundError('Invalid user id')
  }

  const userWishlist = await WishlistModel.find({ user_id: req.params.id })
  res.status(StatusCodes.OK).json({ success: true, data: userWishlist })
}

const createWishlistItem = async (req, res) => {
  if (!req.user.userId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.userId != req.params.id) {
    throw new NotFoundError('Invalid user id')
  }

  if (!req.body.product_id || req.body.product_id == '') {
    throw new BadRequestError('Please provide product id')
  }
  const productId = await ProductModel.find({ _id: req.body.product_id })
  if (!productId || productId == '') {
    throw new BadRequestError('Please provide valid product id')
  }

  // duplicate validation
  const isDuplicate = await WishlistModel.find({
    'user_id': { $eq: req.params.id },
    'product_id': { $eq: req.body.product_id },
  })
  if (isDuplicate && isDuplicate != '') {
    throw new BadRequestError('Duplicates found')
  }

  const userWishlist = await WishlistModel.create({ user_id: req.params.id, product_id: req.body.product_id })

  res.status(StatusCodes.CREATED).json({ success: true, data: userWishlist })
}

const deleteWishlistItem = async (req, res) => {
  if (!req.user.userId) {
    throw new UnauthenticatedError('Unauthorized to access this route')
  }
  if (req.user.userId != req.params.id) {
    throw new NotFoundError('Invalid user id')
  }
  if (!req.params.itemid || req.params.itemid == '') {
    throw new BadRequestError('Please provide valid item id')
  }

  const userWishlist = await WishlistModel.deleteOne({ _id: req.params.itemid })
  if (userWishlist.deletedCount == 0) {
    throw new NotFoundError('Item does not exist')
  }
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: `Item deleted successfully`, deletedCount: userWishlist.deletedCount })
}

module.exports = {
  getWishlist,
  createWishlistItem,
  deleteWishlistItem,
}
