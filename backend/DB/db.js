const mongoose = require('mongoose');

// function connectDB() {

//     try{
//         mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true, useUnifiedTopology: true });
//     }
//     catch(err){
//         console.log('Error connecting to the database', err);
//     }

//     // mongoose.connect(process.env.MONGO_URI)
//     // .then(() => {
//     //     console.log('Connected to the database');
//     // })
//     // .catch((err) => {
//     //     console.log('Error connecting to the database', err);
//     // });
// }

const connectDB = (url)=>{
    return mongoose.connect(url)
}


module.exports = connectDB;
