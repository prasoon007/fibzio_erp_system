const mongoose = require('mongoose');

const FeeSchema = mongoose.Schema({
    course_name:{
        type: String
    },
    total_fees: String,
    break_up: String,
    deadline_date: String,
    min_amount_allowed: String,
    relaxation: String
})

module.exports = mongoose.model('fee', FeeSchema);