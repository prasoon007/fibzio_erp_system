const express = require("express");
const router = express.Router();
const studentController = require('../controllers/student.controller');
const middleware = require('../middlewares/validation');

router.get('/fetchStudent_rr/:studentId', middleware.fetchUser, studentController.fetchStudent_rr);
router.get('/fetchStudents_cc/:courseId', middleware.fetchUser, studentController.fetchStudents_cc);
router.post('/addStudent/:courseId', middleware.fetchUser, middleware.validateStudentPost, studentController.addStudent);
router.put('/updateStudent/:studentId', middleware.fetchUser, middleware.validateStudentPut, studentController.updateStudent);
router.delete('/deleteStudent/:courseId/:studentId', middleware.fetchUser, studentController.deleteStudent);

module.exports = router;