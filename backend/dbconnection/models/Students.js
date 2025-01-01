const { Schema, model } = require('mongoose');

 const studentSChema = new Schema({
 email: String,
  name: String,
  program:String,
  programs:{
    type: Schema.Types.Mixed,
    default: {},
  },
  status:String,
  type:String,
  id:String
},{strict:false}); 
module.exports = model('Student', studentSChema);

// module.exports = User;