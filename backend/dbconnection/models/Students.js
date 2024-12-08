const { Schema, model } = require('mongoose');

 const studentSChema = new Schema({
 email: String,
  name: String,
  dateStarted:String,
  buildingName:String,
  group:String,
  program:String,
  programs:{
    type: Schema.Types.Mixed,
    default: {},
  },
  status:String,
  programStatus:{
    type: Schema.Types.Mixed,
    default: {},
  },
  type:String,
  id:String
},{strict:false});
module.exports = model('Student', studentSChema);

// module.exports = User;