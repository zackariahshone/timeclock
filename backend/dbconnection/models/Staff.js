const { Schema, model } = require('mongoose');

 const StaffSchema = new Schema({
 email:{
  type:String
 },
  name: {
    type: String,
  },
  dateStarted:{
    type:Date,
  },
  group:String,
  program:String,
  status:String,
});

module.exports =  model('Staff', StaffSchema);

// module.exports = User;