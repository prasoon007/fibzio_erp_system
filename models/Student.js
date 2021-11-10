const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
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
        required: true
    },
    course_code: String,
    dob: Date,
    address: [{
        type: String,
        required: true
    }],
    phone_number: [{
        type: String,
        required: true
    }],
    student_status: {
        type: String,
        required: true
    },
    fee_status: {
        reciept: [{String}],
        late_fees: String,
        paid: String,
        pending: String
    },
    parent: {
        fathers_name: String,
        mothers_name: String,
        Mob_number: [{String}]
    }
})

module.exports = mongoose.model('student', StudentSchema);