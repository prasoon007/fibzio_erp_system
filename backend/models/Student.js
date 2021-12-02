const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    roll_number: {
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
        required: true,
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
    fee_status: {
        reciept: [{
            type: String
        }],
        total_fees: Number,
        total_pending: Number,
        fee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fee'
        },
        addon: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'addon'
        }]
    },
    parent: {
        fathers_name: String,
        mothers_name: String,
        mob_number: [{
            type: Number,
            unique: true
        }]
    }
})

module.exports = mongoose.model('student', StudentSchema);