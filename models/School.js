const mongoose = require('mongoose');

const SchoolSchema = mongoose.Schema({
    school_name: String,
    school_code: String,
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
})

module.exports = mongoose.model('school', SchoolSchema);