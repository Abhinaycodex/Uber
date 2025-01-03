const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
app.use(cors());
port = 3000;

const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./DB/db');
connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app; 