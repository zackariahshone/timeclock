const { Schema, model } = require('mongoose');

 const historySChema = new Schema({
    id: String,
    clockedInOutHistory: Array
});
module.exports = model('History', historySChema);

