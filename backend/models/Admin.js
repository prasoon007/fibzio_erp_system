const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
})

module.exports = mongoose.model('admin', AdminSchema);