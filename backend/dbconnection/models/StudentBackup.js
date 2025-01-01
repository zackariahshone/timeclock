const { Schema, model } = require('mongoose');

 const studentSChema = new Schema({
 email: String,
  name: String,
  program:String,
  status:String,
  type:String,
  id:String
});
module.exports = model('StudentBackup', studentSChema);