const fees = require('../models/Fee'),
    courses = require('../models/Course'),
    student = require('../models/Student'),
    addon = require('../models/Addon');

const feeService = {};

//TODO:- Fetch Course fee through course_code when student_RR api is hit
//TODO:- Add addon add and delete route

feeService.addFees = async (courseId, data) => {
    try {
        const foundCourse = await courses.findById(courseId);
        const addedFee = await fees.create(data);
        foundCourse.fee.push(addedFee);
        foundCourse.save();
        return addedFee;
    } catch (error) {
        console.log(`Fee add error:  ${error}`)
    }
}


feeService.updateFees = async (feeId, data) => {
    try {
        const updatedFees = await fees.findByIdAndUpdate(feeId, data, { new: true });
        if (!updatedFees) return console.log('Could not update fee');
        return updatedFees;
    } catch (error) {
        console.log(`Fee update error: ${error}`)
    }
}

feeService.deleteFees = async (courseId, feeId) => {
    try {
        const deletedFees = await fees.findByIdAndDelete(feeId);
        const updatedCourse = await courses.findByIdAndUpdate(courseId, { $pull: { fee: feeId } }, { new: true });
        return deletedFees;
    } catch (error) {
        console.log(`Fee delete error: ${error}`);
    }
}

feeService.addAddon = async (studentId, data) => {
    try {
        const foundStudent = await student.findById(studentId);
        const addedAddon = await addon.create(data);
        foundStudent.fee_status.addon.push(addedFees);
        foundStudent.save();
        return addedAddon;
    } catch (error) {
        console.log(`Fee Addition error: ${error}`);
    }
}

feeService.updateAddon = async (addonId, data) => {
    try {
        const updatedAddon = await addon.findByIdAndUpdate(addonId, data, { new: true });
        if (!updatedAddon) return console.log('Could not update fee');
        return updatedAddon;
    } catch (error) {
        console.log(`Fee Update error: ${error}`);
    }
}

feeService.deleteAddon = async (studentId, addonId) => {
    try {
        const deletedAddon = await addon.findByIdAndDelete(addonId);
        const updatedStudent = await student.findByIdAndUpdate(studentId, { pull: { fee: feeId } }, { new: true });
        return deletedAddon;
    } catch (error) {
        console.log(`Fee delete error: ${error}`);
    }
}

module.exports = feeService;