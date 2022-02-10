const express = require('express')
const { companyIdGenerate } = require('../middlewares/company-auth')
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
} = require('../controllers/products')
const router = express.Router()

router.route('/').get(getAllProducts).post(companyIdGenerate, createProduct)
router
  .route('/:id')
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct)

router.route('/:id/reviews').get(getProductReviews)

module.exports = router
