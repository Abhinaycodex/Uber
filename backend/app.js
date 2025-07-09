const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const connectDB = require('./DB/db');

// Connect to database
connectDB(process.env.MONGO_URI)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log('Error connecting to the database', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

module.exports = app; 