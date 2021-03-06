const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    student_id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    course_code: {
        type: String,
        required: true
    },
    dob: Date,
    address: [{
        type: String,
        required: true
    }],
    phone_number: [{
        type: Number,
        required: true,
        unique: true
    }],
    student_status: {
        type: String,
        required: true
    },
    fees_status: {
        reciept: [{
            type: String
        }],
        pending: Number,
        charge: Number,
        addon: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'addon'
        }]
    },
    parent: {
        fathers_name: String,
        mothers_name: String,
        mob_number: {
            type: Number,
            unique: true
        }
    }
})

module.exports = mongoose.model('student', StudentSchema);