const express = require("express");
const router = express.Router();
const studentController = require('../controllers/student.controller');
const middlewareObj = require('../middlewares/index');

router.get('/fetchStudent_rr/:studentId', studentController.fetchStudent_rr);
router.get('/fetchStudents_cc/:courseId', studentController.fetchStudents_cc);
router.post('/addStudent/:courseId', middlewareObj.validateStudentPost, studentController.addStudent);
router.put('/updateStudent/:studentId', middlewareObj.validateStudentPutDelete, studentController.updateStudent);
router.delete('/deleteStudent/:courseId/:studentId', middlewareObj.validateStudentPutDelete, studentController.deleteStudent);

module.exports = router;