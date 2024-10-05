const mongoose = require('mongoose');
require('dotenv').config()
const db = 'mongodb://localhost:27017/example';
const connectionString = 'mongodb+srv://ZackShone:1234@clustertruck.dvwuahh.mongodb.net/?retryWrites=true&w=majority';//process.env.MONGO_CONNECTION;
const connection = mongoose.connect(db);

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
