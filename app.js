require('dotenv').config()
require('express-async-errors')
const express = require('express')


const connectDB = require('./database/connect')
const errorHandlerMiddleWare = require('./middleware/error-handler')
const NotFound = require('./middleware/notFound') 

const app = express()

app.use(express.json())




//routes
app.use(errorHandlerMiddleWare)
app.use(NotFound)


const PORT = process.env.PORT || 5000

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
