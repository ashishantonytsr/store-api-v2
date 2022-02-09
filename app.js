require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// extra security packages import

// connect db
const connectDB = require('./db/connect')

// routers import
const companyAuth = require('./routes/company-auth')
const userAuth = require('./routes/user-auth')
const productsRoute = require('./routes/products')

// json middleware
app.use(express.json())

// middlewares import
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

// routes
app.get('/', (req, res) => {
  res.send("<h1>Store-api-v2</h1><a href='/api/v2/auth/login'>login page</a>")
})
app.use('/api/v2/company/auth', companyAuth)
app.use('/api/v2/auth', userAuth)
app.use('/api/v2/products', productsRoute)

// middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT
const start = async () => {
  try {
    console.log('Connecting to Database...')
    await connectDB(process.env.MONGO_URI)
    await app.listen(port, () =>
      console.log(`Server is listening on port ${port}`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
