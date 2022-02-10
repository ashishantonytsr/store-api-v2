const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const ProductModel = require('../models/Product')
const CompanyModel = require('../models/Company')

const getAllProducts = async (req, res) => {
  res.send('get all products')
}

const getSingleProduct = async (req, res) => {
  res.send('get single product')
}

const getProductReviews = async (req, res) => {
  res.send('reviews on product x')
}

// company only
const createProduct = async (req, res) => {
  // duplicate validation
  const isDuplicate = await ProductModel.find({
    company_id: req.user.companyId,
  })
    .where('title')
    .equals(req.body.title)
    .where('price')
    .equals(req.body.price)

  if (isDuplicate && isDuplicate != '') {
    throw new BadRequestError('Duplicates found')
  }

  const product = await ProductModel.create(req.body)
  // 626b, 5.15s // 603b, 1.2s
  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: `Product '${product.title}' successfully added`,
    user: { name: req.user.name, email: req.user.email },
    data: product,
  })
}

const updateProduct = async (req, res) => {
  res.send('update products')
}

const deleteProduct = async (req, res) => {
  res.send('delete product')
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  getProductReviews,
  createProduct,
  updateProduct,
  deleteProduct,
}
