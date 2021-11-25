const students = require('../models/Student'),
    courses = require('../models/Course'),
    schools = require('../models/School');

const studentService = {};

studentService.fetchStudent_rr = async (studentId) => {
    try {
        const foundStudent = await students.findById(studentId).select('name fee_status roll_number course_code');
        if (!foundStudent) return console.log('Student search error');
        return foundStudent;
    } catch (error) {
        console.log(`Student fetch error: ${error}`);
    }
};

studentService.fetchStudents_cc = async (courseId) => {
    try {
        const foundCourse = await courses.findById(courseId).populate('students');
        if (!foundCourse) return console.log('Course search error');
        return foundCourse.students;
    } catch (error) {
        console.log(`Students fetch error: ${error}`);
    }
};

studentService.addStudent = async (courseId, data) => {
    try {
        const foundCourse = await courses.findById(courseId);
        if (!foundCourse) return console.log("Course search error");
        const addedStudent = await students.create(data);
        if (!addedStudent) return console.log('Student create error');
        addedStudent.course_id = courseId;
        addedStudent.save();
        foundCourse.students.push(addedStudent);
        foundCourse.save();
        return addedStudent;
    } catch (error) {
        console.log(`Student add error: ${error}`);
    }
};

studentService.updateStudent = async (studentId, data) => {
    try {
        const updatedStudent = await students.findByIdAndUpdate(studentId, data, { new: true });
        if (!updatedStudent) return console.log('Student search and update error');
        return updatedStudent;
    } catch (error) {
        console.log(`Student update error: ${error}`);
    }
};

studentService.deleteStudent = async (courseId, studentId) => {
    try {
        const deletedStudent = await students.findByIdAndDelete(studentId);
        if (!deletedStudent) return console.log('Student search and delete error');
        const updatedCourse = await courses.findByIdAndUpdate(courseId, { $pull: { students: studentId } }, { new: true });
        if (!updatedCourse) return console.log('Course search and update failed');
        return deletedStudent;
    } catch (error) {
        console.log(`Student delete error: ${error}`);
    }
};

module.exports = studentService;