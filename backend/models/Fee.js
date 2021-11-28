const mongoose = require('mongoose');

const FeeSchema = mongoose.Schema({
    course_name: Number,
    total_fees: Number,
    breakup: Number,
    deadline_date: Date,
    min_amount_allowed: Number,
    relaxation: Number
})

module.exports = mongoose.model('fee', FeeSchema);