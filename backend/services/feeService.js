const fees = require('../models/Fee'),
    courses = require('../models/Course'),
    student = require('../models/Student');

const feeService = {};

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

feeService.addFees_SS = async (studentId, data) => {
    try {
        const foundStudent = await student.findById(studentId);
        const addedFees = await fees.create(data);
        foundStudent.fee_status.fee.push(addedFees);
        foundStudent.save();
        return addedFees;
    } catch (error) {
        console.log(`Fee delete error: ${error}`);
    }
}

feeService.updateFees_SS = async (feeId, data) => {
    try {
        const updatedFees = await fees.findByIdAndUpdate(feeId, data, { new: true });
        if (!updatedFees) return console.log('Could not update fee');
        return updatedFees;
    } catch (error) {
        console.log(`Fee delete error: ${error}`);
    }
}

feeService.deleteFees_SS = async (studentId, feeId) => {
    try {
        const deletedFees = await fees.findByIdAndDelete(feeId);
        const updatedStudent = await student.findByIdAndUpdate(studentId, { pull: { fee: feeId } }, { new: true });
        return deletedFees;
    } catch (error) {
        console.log(`Fee delete error: ${error}`);
    }
}

module.exports = feeService;