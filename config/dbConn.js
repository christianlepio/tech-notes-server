// import mongoose
const mongoose = require('mongoose')

// connect to mongoDB function
const connectDB = async () => {
    try {
                                // URI
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.error('MongoDB connection error: ', err)
    }
}

module.exports = connectDB