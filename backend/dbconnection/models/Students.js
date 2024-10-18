const { Schema, model } = require('mongoose');

 const studentSChema = new Schema({
 email: String,
  name: String,
  dateStarted:String,
  buildingName:String,
  group:String,
  program:String,
  status:String,
  history:Array,
  type:String,
  id:String
});
module.exports = model('Student', studentSChema);

// module.exports = User;