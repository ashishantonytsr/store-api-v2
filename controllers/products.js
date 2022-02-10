const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const ProductModel = require('../models/Product')
const CompanyModel = require('../models/Company')

const getAllProducts = async (req, res) => {
  const product = await ProductModel.find({
    'company_id': { $eq: req.user.companyId },
  })
  res.json({
    success: true,
    count: product.length,
    product: product,
  })
}

const getSingleProduct = async (req, res) => {
  res.send('get single product')
}

const getProductReviews = async (req, res) => {
  res.send('reviews on product x')
}

const createProduct = async (req, res) => {
  // duplicate validation
  const isDuplicate = await ProductModel.find({
    'company_id': { $eq: req.user.companyId },
    'title': { $eq: req.body.title },
    'price': { $eq: req.body.price },
  })

  if (isDuplicate && isDuplicate != '') {
    throw new BadRequestError('Duplicates found')
  }

  const product = await ProductModel.create(req.body)
  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: `Product '${product.title}' successfully added`,
    // user: { name: req.user.name, email: req.user.email },
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
