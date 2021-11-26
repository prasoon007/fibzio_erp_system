const mongoose = require('mongoose');

const FeeSchema = mongoose.Schema({
    course_name: Number,
    total_fees: Number,
    break_up: Number,
    deadline_date: Date,
    min_amount_allowed: Number,
    relaxation: String
})

module.exports = mongoose.model('fee', FeeSchema);