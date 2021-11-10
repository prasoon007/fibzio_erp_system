const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school'
    },
    course_name: {
        type: String,
        unique: true
    },
    course_code: {
        type: String,
        unique: true
    },
    school_code: {
        type: String,
    },
    fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fee'
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