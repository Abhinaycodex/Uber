const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
port = 3000;
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const connectDB = require('./DB/db');


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    } catch (err) {
        console.log('Error connecting to the database', err);
    }
    
}

start();

module.exports = app; 