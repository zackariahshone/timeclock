const { Schema, model } = require('mongoose');

 const prefSchema = new Schema({ 
   
},{strict:false});
module.exports = model('Preference', prefSchema);

