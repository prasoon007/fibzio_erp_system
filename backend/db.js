const mongoose = require('mongoose');
require('dotenv').config()

var mongoDB = /*process.env.DB_URL || */ 'mongodb://127.0.0.1/erp';

connectToMongo = () => {
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.on('connected', () => {
        console.log("Connected to MongoDB servers");
    })
}

module.exports = connectToMongo;