const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school'
    },
    fee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fee'
    }],
    course_name: {
        type: String,
    },
    course_code: {
        type: String,
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