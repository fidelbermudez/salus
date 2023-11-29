const mongoose = require('mongoose');

const cateogrySchema = new mongoose.Schema({
    month: Number,
    year: Number,
    category_name: String,
    user: Number,
    amount_spent: Number,
    limit: { type: Number, default: 0 }
}, {collection: "category"});

module.exports = mongoose.model('category', cateogrySchema);
