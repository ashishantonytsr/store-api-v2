const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const WishlistSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

const CartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide user name'],
    minlength: 3,
    maxlength: 25,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    minlength: 8,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
  },
  address: {
    type: String,
    minlength: 15,
  },
  contact_number: {
    type: Number,
    required: [true, 'Please provide contact number'],
    minlength: 5,
    unique: true,
  },
  wishlist: [WishlistSchema],
  cart: [CartSchema],
})

// to hash password before storing
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

// to create jsonWebToken
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  )
}

module.exports = mongoose.model('User', UserSchema)
