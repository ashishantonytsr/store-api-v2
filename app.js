require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// imports
const connectDB = require('./db/connect')

// routes
app.get('/', (req,res)=>{
	res.send('store-api-v2')
})

const port = process.env.PORT

const start = async()=>{
	try {
		console.log('Connecting to Database...');
		await connectDB(process.env.MONGO_URI)
		await app.listen(port, ()=> console.log(`Server is listening on port ${port}`) )
	} catch (error) {
		console.log(error);		
	}
}

start()
