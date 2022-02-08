require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// extra security packages import

// connect db
const connectDB = require('./db/connect')

// routers import

// middlewares import
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')


// json middleware
app.use(express.json())

// routes
app.get('/', (req,res)=>{
	res.send('store-api-v2')
})

// middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

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
