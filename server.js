const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


// Load env vars
dotenv.config({ path: './config/.env' });


// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');


const app = express();

// Body parser middleware so we can parse json in req.body
app.use(express.json());

// Dev logging middleware using morgan npm package
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// file uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
// This is done so you dont have to write out this path 
// for every route in the bootcamps.js file
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message.red}`);

    //close server and exit process
    server.close(() => process.exit(1));
});