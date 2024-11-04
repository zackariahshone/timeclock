const { Schema, model } = require('mongoose');

 const studentSChema = new Schema({
 email: String,
  name: String,
  dateStarted:String,
  buildingName:String,
  group:String,
  program:String,
  status:String,
  type:String,
  id:String
});
module.exports = model('StudentBackup', studentSChema);