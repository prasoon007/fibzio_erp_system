const mongoose = require('mongoose');

const FeeSchema = mongoose.Schema({
    course_name: Number,
    total_fees: Number
})

module.exports = mongoose.model('fee', FeeSchema);