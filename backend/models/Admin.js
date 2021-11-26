const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    authLev: Number
})

module.exports = mongoose.model('admin', AdminSchema);