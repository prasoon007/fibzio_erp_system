const schools = require('../models/School'),
    courses = require('../models/Course'),
    fees = require('../models/Fee');

const schoolService = {};

schoolService.fetchSchool = async () => {
    try {
        const allSchools = await schools.find({});
        return allSchools;
    } catch (error) {
        console.log(`Schools fetch error: ${error}`);
    }
}

schoolService.fetchSchool_s = async (schoolId) => {
    try {
        const foundSchool = await schools.findById(schoolId);
        return foundSchool;
    } catch (error) {
        console.log(`School fetch error: ${error}`);
    }
}

schoolService.addSchool = async (data) => {
    try {
        const createdSchool = await schools.create(data);
        return createdSchool;
    } catch (error) {
        console.log(`School add error: ${error}`);
    }
}

schoolService.updateSchool = async (schoolId, data) => {
    try {
        const foundSchool = await schools.findByIdAndUpdate(schoolId, data, { new: true }).select("-course");
        return foundSchool;
    } catch (error) {
        console.log(`School update error: ${error}`);
    }
}

schoolService.deleteSchool = async (schoolId) => {
    try {
        // find one school
        const findSchool = await schools.findOne({ _id: schoolId });
        if (!findSchool) return console.log('School Not Found');
        const findCourses = await courses.find({ _id: { $in: findSchool.course } });
        findCourses.map(async (course) => {
            const deletedStudents = await students.deleteMany({ _id: { $in: course.students } });
            if (!deletedStudents) console.log('Students Not Deleted. Please Contact the Admin');
            const deletedFees = await fees.deleteMany({ _id: { $in: course.fee } });
            if (!deletedFees) console.log('Course Fee Not Deleted. Please Contact the Admin');
            const deletedCourses = await courses.deleteMany({ _id: { $in: findSchool.course } });
            if (!deletedCourses) console.log('Courses Not Deleted. Please Contact the Admin');
        })
        const deletedSchool = await schools.deleteOne({ _id: schoolId });
        if (!deletedSchool) return console.log('School Deletion Failed. Please Contact the Admin');
        return deletedSchool;
    } catch (error) {
        console.log(`School delete error: ${error}`);
    }
}

module.exports = schoolService;