const mongoose = require('mongoose')

const ReviewsSchema = new mongoose.Schema({
	customer_id:{
		type: mongoose.Types.ObjectId,
		ref: 'Customer',
		required: [true, 'Please provide customer id']
	},
	product_id:{
		type: mongoose.Types.ObjectId,
		ref: 'Product',
		required: [true, 'Please provide product id']
	},
	title: {
		type: String,
		required: [true, 'Please provide a title'],
		minlength: 3,
		maxlength: 20
	},
	description: {
		type: String
	},
	rating: {
		type: Number,
		required: [true, 'Please provide a star rating'],
		max: 5
	}
},
	{timestamps} )


module.exports = mongoose.model('Reviews', ReviewsSchema)