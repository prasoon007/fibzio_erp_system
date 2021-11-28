const admins = require('../models/Admin'),
    students = require('../models/School'),
    schools = require('../models/School'),
    parents = require('../models/Student');
const schoolService = require('./schoolService');
const authService = {};

authService.authAdminSchoolLogin = async (username, authLev) => {
    try {
        if(authLev == 0) return await admins.findOne({username}).select('+password');
        else if(authLev == 1) return await schools.findOne({username}).select('+password');
    } catch (error) {
        console.log(`AS login error: ${error}`);
    }
}

authService.authStudentParentLogin = async(email) => {
    try {
        return await students.findOne({email}).select('+password');
    } catch (error) {
        console.log(`SP login error: ${error}`);
    }
}



module.exports = authService;