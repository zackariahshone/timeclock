const mongoose = require('mongoose');
require('dotenv').config()
const uri = "mongodb+srv://zackariahshone:Zs72756AR4010!@nonprofitcluster.oe6muis.mongodb.net/?retryWrites=true&w=majority&appName=nonProfitCluster";

const db = 'mongodb://localhost:27017/example';
const connection = mongoose.connect(uri);

mongoose.set(
    {
        'debug': true,
        autoIndex:true
    }
    );

    const conSuccess = mongoose.connection
    conSuccess.once('open', _ => {
      console.log('Database connected:', db)
    })

module.exports = connection
