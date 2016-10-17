// Next, create a models directory in mongo-shopping-list. 
// This will contain your Mongoose models. Then use Mongoose 
// to create the item model in models/item.js

var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;