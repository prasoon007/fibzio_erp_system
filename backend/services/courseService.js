const courses = require('../models/Course'),
      schools = require('../models/School'),
      students = require('../models/Student');

const courseService = {};

courseService.fetchCourses = async (schoolId) => {
    try {
        const foundSchool = await schools.findById(schoolId).populate('course');
        if (!foundSchool) return console.log('School search error');
        return foundSchool.course;
    } catch (error) {
        console.log(`Course fetch error:  ${error}`)
    }
};

courseService.addCourse = async (schoolId, data) => {
    try {
        const foundSchool = await schools.findById(schoolId);
        if (!foundSchool) return console.log("School search error");
        const c_id = String(data.course_name + foundSchool.school_code); //*Automatically generating course code
        data.course_code = c_id;
        const addedCourse = await courses.create(data);
        if (!addedCourse) return console.log("Course create error");
        addedCourse.school_id = schoolId;
        addedCourse.save();
        foundSchool.course.push(addedCourse);
        foundSchool.save();
        return addedCourse;
    } catch (error) {
        console.log(`Course add error:  ${error}`)
    }
};

courseService.updateCourse = async (courseId, data) => {
    try {
        const updatedCourse = await courses.findByIdAndUpdate(courseId, data, { new: true });
        if (!updatedCourse) return console.log('Course search and update');
        return updatedCourse;
    } catch (error) {
        console.log(`Course update error:  ${error}`)
    }
};

courseService.deleteCourse = async (schoolId, courseId) => {
    try {
        const deletedCourse = await courses.findByIdAndDelete(courseId);
        if (!deletedCourse) return console.log('Course search and delete error');
        const deletedStudents = await students.deleteMany({ _id: { $in: deletedCourse.students } });
        const schoolD = await schools.findByIdAndUpdate(schoolId, {$pull: {course: courseId}}, {new: true});
        return deletedCourse;
    } catch (error) {
        console.log(`Course delete error:  ${error}`)
    }
};

module.exports = courseService;