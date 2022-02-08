const express = require('express')
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
} = require('../controllers/products')
const router = express.Router()

router.route('/').get(getAllProducts).post(createProduct)
router
  .route('/:id')
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct)

router.route('/:id/reviews').get(getProductReviews)

module.exports = router
