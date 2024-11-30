const { Schema, model } = require('mongoose');

 const teacherSchema = new Schema({
 email: String,
  name: String,
  dateStarted:String,
  buildingName:String,
  group:String,
  program:String,
  status:String,
  type:String,
  admin:Boolean,
  id:String
});
module.exports = model('Teacher', teacherSchema);

// module.exports = User;