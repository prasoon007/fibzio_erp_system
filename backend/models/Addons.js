const mongoose = require('mongoose');

const AddonSchema = mongoose.Schema({
    course_name: String,
    fee_amount: Number,
    deadline: Date
})

module.exports = mongoose.model('user', AddonSchema);