const getAllProducts = async (req, res) => {
  res.send('get all products')
}

const getSingleProduct = async (req, res) => {
  res.send('get single product')
}

const getProductReviews = async (req, res) => {
  res.send('reviews on product x')
}

const createProduct = async (req, res) => {
  res.send('create products')
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
