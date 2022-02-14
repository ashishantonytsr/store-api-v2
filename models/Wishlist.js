const mongoose = require('mongoose')

const WishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

module.exports = mongoose.model('Wishlist', WishlistSchema)
