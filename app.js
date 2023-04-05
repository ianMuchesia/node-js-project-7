require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');



const connectDB = require('./database/connect')

const authRoute = require('./routes/auth')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')
const errorHandlerMiddleWare = require('./middleware/error-handler')
const NotFound = require('./middleware/notFound') 

const app = express()

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET));




//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders',orderRouter )

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
