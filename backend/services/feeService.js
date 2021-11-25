const fees = require('../models/Fee'),
    courses = require('../models/Course');

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

module.exports = feeService;