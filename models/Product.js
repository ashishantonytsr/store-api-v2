const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide product name'],
      minlength: 3,
      maxlength: 30,
    },
    desciption: {
      type: String,
      minlength: 10,
      maxlength: 50,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      max: 5,
    },
    company_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Please provide company id'],
    },
    category: {
      type: String,
      enum: ['electronics', 'fashion', 'daily essentials', 'books'],
      required: [true, 'Please provide a category'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema)
