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
    authLev: Number,
    course_code: String,
    dob: Date,
    address: [{
        type: String,
        required: true
    }],
    phone_number: [{
        type: Number,
        required: true
    }],
    student_status: {
        type: String,
        required: true
    },
    fee_status: {
        reciept: [{
            type: String
        }],
        late_fees:  Number,
        paid: Number,
        pending: Number
    },
    parent: {
        fathers_name: String,
        mothers_name: String,
        mob_number: [{
            type: Number
        }]
    }
})

module.exports = mongoose.model('student', StudentSchema);