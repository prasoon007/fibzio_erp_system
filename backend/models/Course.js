const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    fee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fee'
    }],
    course_name: {
        type: String,
    },
    course_code: {
        type: String,
        unique: true
    },
    school_code: {
        type: String,
    },
    date: {
        start_date: Date,
        end_date: Date
    },
    students_count: String,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }]
})


module.exports = mongoose.model('course', CourseSchema);