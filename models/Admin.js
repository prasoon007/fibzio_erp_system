const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: true
})

module.exports = mongoose.model('admin', AdminSchema);