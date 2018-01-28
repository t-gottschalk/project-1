var mongoose = require('mongoose');

var PriceSchema = new mongoose.Schema(
    {
        currency: 'string',
        price: 'number',
        date: 'number'
    }
);

var Price = mongoose.model('Price' , PriceSchema);

module.exports = Price;