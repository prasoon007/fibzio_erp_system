const mongoose = require('mongoose');

//*Late Fees Charge
const FeeSchema = mongoose.Schema({
    fees_name: String,
    total_fees: Number,
    late_fees_charge: Number
})

module.exports = mongoose.model('fee', FeeSchema);