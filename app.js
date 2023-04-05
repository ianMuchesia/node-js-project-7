require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors')

const connectDB = require('./database/connect')

const authRoute = require('./routes/auth')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const errorHandlerMiddleWare = require('./middleware/error-handler')
const NotFound = require('./middleware/notFound') 

const app = express()

app.use(express.json())




//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)

app.use(errorHandlerMiddleWare)
app.use(NotFound)


const PORT = process.env.PORT || 3000

const start = async()=>{
    try {
     connectDB(process.env.MONGO_URI)
        app.listen(PORT,()=>{
            console.log(`server is listening at port ${PORT}`)
        } )
    } catch (error) {
        console.log(error)
    }
}
start()
