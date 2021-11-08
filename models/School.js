const mongoose = require('mongoose');

const SchoolSchema = mongoose.Schema({
    name: String,
    school_code: String,
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
})