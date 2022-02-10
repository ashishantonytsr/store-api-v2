const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('../errors')
const ProductModel = require('../models/Product')
const CompanyModel = require('../models/Company')

const getAllProducts = async (req, res) => {
  let products = {}

  // init queryObj
  // collect data from req.query
  // validata data & add to queryObj
  // if numericFilter: create operatormap
  // replace <><=>= with $lt, $gt, $lte, $gte in numericFilters

  if (req.user.companyId) {
    products = await ProductModel.find({
      'company_id': { $eq: req.user.companyId },
    }) // add queryObj
  }

  // if (req.user.userId) {
  //   products = await ProductModel.find({
  //     // queryObj only
  //   })
  // }

  // if sort is provided as query params; sort products
  // if fields are provided as query params, select fields from product
  // if page/limit is provided,
  // create skip as (page -1)* limit
  // products.limit().skip()

  res.status(StatusCodes.OK).json({
    success: true,
    count: products.length,
    product: products,
  })
}

const getSingleProduct = async (req, res) => {
  let product = {}

  // if logged in as company
  if (req.user.companyId) {
    product = await ProductModel.find({
      '_id': { $eq: req.params.id },
      'company_id': { $eq: req.user.companyId },
    })
  }

  // // if logged in as customer
  // if (req.user.userId) {
  //   product = await ProductModel.find({
  //     '_id': { $eq: req.params.id },
  //   })
  // }

  if (!product || product == '') {
    throw new BadRequestError(`No product with id '${req.params.id}'`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const createProduct = async (req, res) => {
  // TODO: check if customer can create product

  // if (req.user.userId){
  // 	throw new NotFoundError('Route does not exist')
  // }

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
    data: product,
  })
}

const updateProduct = async (req, res) => {
  // check if there is a company with companyId
  res.send('update products')
}

const deleteProduct = async (req, res) => {
  res.send('delete product')
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
