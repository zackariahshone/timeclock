const { Schema, model } = require('mongoose');

 const historySChema = new Schema({
    name: String,
    clockedInOutHistory: Object
});
module.exports = model('History', historySChema);