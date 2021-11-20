const studentServices = require('../services/studentService');

const studentCtrl = {};

studentCtrl.fetchStudents_ss = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const fetchedStudents = await studentServices.fetchStudents_ss(schoolId);
        !fetchedStudents ? res.status(404).send('Students fetch error') : res.send(fetchedStudents);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

studentCtrl.fetchStudent_rr = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        const fetchedStudent = await studentCtrl.fetchStudent_rr(studentId);
        !fetchedStudent ? res.status(404).send('Student fetch error') : res.send(fetchedStudent);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

studentCtrl.fetchStudents_cc = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const fetchedStudents = await studentServices.fetchStudents_cc(courseId);
        !fetchedStudents ? res.status(404).send('Students fetch error') : res.send(fetchedStudents);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

studentCtrl.addStudent = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const data = req.body;
        const addedStudent = await studentServices.addStudent(courseId, data);
        !addedStudent ? res.status(404).send('Student add error') : res.send(addedStudent);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

studentCtrl.updateStudent = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        const data = req.body;
        const updatedStudent = await studentServices.updateStudent(studentId, data);
        !updatedStudent ? res.status(404).send('Student update error') : res.send(updatedStudent);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

studentCtrl.deleteStudent = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.params.studentId;
        const deletedStudent = await studentServices.deleteStudent(courseId, studentId);
        !deletedStudent ? res.status(404).send('Student delete error') : res.send(deletedStudent);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

module.exports = studentCtrl;