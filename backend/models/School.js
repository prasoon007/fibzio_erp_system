const mongoose = require('mongoose');

const SchoolSchema = mongoose.Schema({
    school_name: {
        type: String,
        required: true,
        uppercase: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    school_code: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
})

module.exports = mongoose.model('school', SchoolSchema);