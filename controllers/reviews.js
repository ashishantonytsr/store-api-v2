const getAllProductReviews = async (req, res) => {
  res.send('reviews on product x')
}

const getSingleProductReview = async (req, res) => {
  res.send('single reviews on product x')
}

const createProductReview = async (req, res) => {
  res.send('create product review')
}

const updateProductReview = async (req, res) => {
  res.send('update product review')
}

const deleteProductReview = async (req, res) => {
  res.send('delete product review')
}

module.exports = {
  getAllProductReviews,
  getSingleProductReview,
  createProductReview,
  updateProductReview,
  deleteProductReview,
}
