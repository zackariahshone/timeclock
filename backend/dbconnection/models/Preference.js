const { Schema, model } = require('mongoose');

 const prefSchema = new Schema({ 
    status:String,
},{strict:false});
module.exports = model('Preference', prefSchema);

