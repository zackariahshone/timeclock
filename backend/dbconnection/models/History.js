const { Schema, model } = require('mongoose');

 const historySChema = new Schema({
    id: String,
    clockedInOutHistory: Array,
    'Richardson Industries':Array,
    Aspire:Array
},{strict:false});
module.exports = model('History', historySChema);

