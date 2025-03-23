const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

//route files
const coworkingspaces = require('./routes/coworkingspaces');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');

//load env vars
dotenv.config({path : './config/config.env'});

//connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent XSS attacks
app.use(xss());

//rate limiting
const limiter = rateLimit({
    windowMs: 10*60*1000, //10 mins
    max: 100
});
app.use(limiter);

//prevent http param pollutions
app.use(hpp());

//enable CORS
app.use(cors());

//mount routers
app.use('/api/v1/coworkingspaces',coworkingspaces);
app.use('/api/v1/auth',auth);
app.use('/api/v1/reservations',reservations);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, "on " + process.env.HOST + ":" + PORT));

//handle unhandled promise rejections
process.on('unhandledRejection', (err,Promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});