const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

module.exports = mongoose.model('Cart', CartSchema)
