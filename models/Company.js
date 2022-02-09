const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    minlength: 3,
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
  },
})

// to hash password before storing
CompanySchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// to compare password
CompanySchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

// to create jwt
CompanySchema.methods.createJWT = function () {
  return (token = jwt.sign(
    { companyId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  ))
}

module.exports = mongoose.model('Company', CompanySchema)
