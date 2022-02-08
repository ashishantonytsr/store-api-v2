const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide product name'],
		minlength: 3,
		maxlength: 20
	},
	price: {
		type: Number,
		required: [true, 'Please provide product price'],
	},
	featured: {
		type: Boolean,
		default: false
	},
	rating: {
		type: Number,
		max: 5
	},
	company_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
		required: [true, 'Please provide company id']
	},
	category: {
		type: String,
		enum: [
			'Electronics', 
			'Fashion', 
			'Daily Essentials', 
			'Books'
		],
		required: [true, 'Please provide a category']
	}
},
	{timestamps} )

module.exports = mongoose.model('Product', ProductSchema)