const mongoose = require('mongoose');

const AddonSchema = mongoose.Schema({
    fee_name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true
    }
});

module.exporrs = mongoose.model('addon', AddonSchema);