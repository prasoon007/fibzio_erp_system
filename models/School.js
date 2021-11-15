const mongoose = require('mongoose');

const SchoolSchema = mongoose.Schema({
    school_name: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    school_code: {
        type: String,
        unique: true
    },
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
})

module.exports = mongoose.model('school', SchoolSchema);