const { Schema, model } = require('mongoose');

 const teacherSchema = new Schema({
 email: String,
  name: String,
  dateStarted:String,
  program:String,
  status:String,
  type:String,
  admin:Boolean,
  id:String
},{strict:false});
module.exports = model('Teacher', teacherSchema);

// module.exports = User;