const mongoose = require('mongoose');

const cateogrySchema = new mongoose.Schema({
    category_id: Number,
    month: Number,
    year: Number,
    category_name: String,
    user: Number,
    user_defined: Boolean
}, {collection: "category"});

module.exports = mongoose.model('category', cateogrySchema);
