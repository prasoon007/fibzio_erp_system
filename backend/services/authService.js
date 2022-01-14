const admins = require('../models/Admin'),
    students = require('../models/School'),
    schools = require('../models/School'),
    parents = require('../models/Student');
const authService = {};

authService.authAdminLogin = async (username) => {
    try {
        return await admins.findOne({ username }).select('+password');
    } catch (error) {
        console.log(`AS login error: ${error}`);
    }
}

authService.authSchoolLogin = async (username) => {
    try {
        return await schools.findOne({ username }).select('+password');
    } catch (error) {
        console.log(`AS login error: ${error}`);
    }
}

authService.authStudentParentLogin = async (email) => {
    try {
        return await students.findOne({ email }).select('+password');
    } catch (error) {
        console.log(`SP login error: ${error}`);
    }
}



module.exports = authService;