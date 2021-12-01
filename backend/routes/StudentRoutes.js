const express = require("express");
const router = express.Router();
const studentController = require('../controllers/student.controller');
const middlewareObj = require('../middlewares/validation');

router.get('/fetchStudent_rr/:studentId', studentController.fetchStudent_rr);
router.get('/fetchStudents_cc/:courseId', studentController.fetchStudents_cc);
router.post('/addStudent/:courseId', middlewareObj.validateStudentPost, studentController.addStudent);
router.put('/updateStudent/:studentId', middlewareObj.validateStudentPut, studentController.updateStudent);
router.delete('/deleteStudent/:courseId/:studentId', studentController.deleteStudent);

module.exports = router;