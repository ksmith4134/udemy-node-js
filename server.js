const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');


// Load env vars
dotenv.config({ path: './config/.env' });


// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');


const app = express();

// Dev logging middleware using morgan npm package
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount bootcamps routers
// This is done so you dont have to write out this path 
// for every route in the bootcamps.js file
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
