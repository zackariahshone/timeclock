const mongoose = require('mongoose');
require('dotenv').config()
// const uri = "mongodb+srv://zackariahshone:Zs72756AR4010!@nonprofitcluster.oe6muis.mongodb.net/?retryWrites=true&w=majority&appName=nonProfitCluster";
const uri = "mongodb+srv://zackariahshone:Zs72756AR4010!@timeclock.dmzpirt.mongodb.net/"
const connection = mongoose.connect(uri);
 
mongoose.set(
    {
        autoIndex:false
    }
    );

    const conSuccess = mongoose.connection
    conSuccess.once('open', _ => {
      console.log('Database connected')
    })  
    
module.exports = connection
