require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// extra security packages import

// connect db
const connectDB = require('./db/connect')

// routers import
const companyRoute = require('./routes/company')
const userRoute = require('./routes/user')
const productsRoute = require('./routes/products')

// json middleware
app.use(express.json())

// middlewares import
const { authMiddleware } = require('./middlewares/company-auth')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

// routes
app.get('/', (req, res) => {
  res.send("<h1>Store-api-v2</h1><a href='/api/v2/auth/login'>login page</a>")
})

app.use('/api/v2/company', companyRoute)
app.use('/api/v2/user', userRoute)
app.use('/api/v2/products', authMiddleware, productsRoute)

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
