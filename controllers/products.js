const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require('../errors')
const ProductModel = require('../models/Product')
const CompanyModel = require('../models/Company')

// FIX: if logged as company, & company doesnot exist, throw error

const getAllProducts = async (req, res) => {
  // query params
  /* title
   * company
   * featured
   *
   * numericFilters = {price, rating}
   *
   * fields
   * sort
   * page
   */

  const { name, company, featured, numericFilters, fields, sort } = req.query

  const queryObj = {}

  if (name) {
    queryObj.title = { $regex: name, $options: 'i' }
  }

  if (company) {
    let companyId = await CompanyModel.find({ name: company }).select('_id')
    if (!companyId || companyId == '') {
      throw new NotFoundError('Company not found')
    }
    companyId = companyId[0]._id.toString()
    queryObj.company_id = companyId
  }

  if (featured) {
    queryObj.featured = featured == 'true' ? true : false
  }

  if (numericFilters) {
    const operatorMap = {
      '<': '$lt',
      '>': '$gt',
      '<=': '$lte',
      '>=': '$gte',
      '=': '$eq',
    }
    const regEx = /\b(<|>|<=|>=|=)\b/g

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )

    const options = ['price', 'rating']
    filters = filters.split(',').map((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) }
      }
    })
  }

  // if logged in as company
  if (req.user.companyId) {
    if (queryObj.company_id && queryObj.company_id != req.user.companyId) {
      throw new UnauthenticatedError(
        'Not authorized to fetch product from another company'
      )
    }
    if (!company || company == '') {
      queryObj.company_id = req.user.companyId
    }
  }

  let products = await ProductModel.find(queryObj)

  // if (sort) {
  //   const sortList = sort.split(',').join(' ')
  //   products = products.sort(sortList)
  // } else {
  //   products = await products.sort('createdAt')
  // }

  // if (fields) {
  //   const fieldsList = fields.split(',').join(' ')
  //   products = products.select(fieldsList)
  // }

  // const page = Number(req.query.page) || 1
  // const limit = Number(req.query.limit) || 10
  // const skip = (page - 1) * limit

  // products = await products.limit(limit).skip(skip)

  res.status(StatusCodes.OK).json({
    success: true,
    count: products.length,
    products: products,
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

  // if logged in as customer
  if (req.user.userId) {
    product = await ProductModel.find({
      '_id': { $eq: req.params.id },
    })
  }

  if (!product || product == '') {
    throw new NotFoundError(`Product not found`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const createProduct = async (req, res) => {
  // TODO: check if customer can create product

  if (req.user.userId) {
    throw new NotFoundError('Route does not exist')
  }

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
    msg: `Product  added successfully`,
    data: product,
  })
}

// TODO: add dynamicity
const updateProduct = async (req, res) => {
  if (req.user.userId) {
    throw new NotFoundError('Route does not exist')
  }

  // TODO: if other than this fields, throw error
  const { title, description, price, featured, category } = req.body
  if (
    title === '' ||
    description === '' ||
    price === '' ||
    featured === '' ||
    category === ''
  ) {
    throw new BadRequestError('Please provide values to be updated')
  }

  const isProductExist = await ProductModel.find({
    _id: req.params.id,
    company_id: req.user.companyId,
  })
  if (!isProductExist || isProductExist == '') {
    throw new NotFoundError('Product not found')
  }

  const product = await ProductModel.findOneAndUpdate(
    { _id: req.params.id, company_id: req.user.companyId },
    req.body,
    { new: true, runValidators: true }
  )

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Product updated successfully`,
    data: product,
  })
}

// TODO: add dynamicity
const deleteProduct = async (req, res) => {
  if (req.user.userId) {
    throw new NotFoundError('Route does not exist')
  }

  const isProductExist = await ProductModel.find({
    _id: req.params.id,
    company_id: req.user.companyId,
  })
  if (!isProductExist || isProductExist == '') {
    throw new NotFoundError('Product not found')
  }

  await ProductModel.findOneAndDelete({
    _id: req.params.id,
    company_id: req.user.companyId,
  })

  res.status(StatusCodes.OK).json({
    success: true,
    msg: `Product deleted successfully`,
  })
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
