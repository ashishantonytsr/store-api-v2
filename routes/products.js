const express = require('express')
const router = express.Router()

const { companyIdGenerate } = require('../middlewares/company-auth')
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products')

const {
  createProductReview,
  getAllProductReviews,
  getSingleProductReview,
  updateProductReview,
  deleteProductReview,
} = require('../controllers/reviews')

// product
router.route('/').get(getAllProducts).post(companyIdGenerate, createProduct)
router.route('/:id').get(getSingleProduct).patch(updateProduct).delete(deleteProduct)

// product reviews
router.route('/:id/reviews').get(getAllProductReviews).post(createProductReview)
router
  .route('/:id/reviews/:reviewid')
  .get(getSingleProductReview)
  .patch(updateProductReview)
  .delete(deleteProductReview)

module.exports = router
