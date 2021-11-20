const express =  require("express");
const router = express.Router();
const studentController = require('../controllers/student.controller');

router.get('/fetchStudents_ss/:schoolId', studentController.fetchStudents_ss);
router.get('/fetchStudent_rr/:studentId', studentController.fetchStudent_rr);
router.get('/fetchStudents_cc/:courseId', studentController.fetchStudents_cc);
router.post('/addStudent/:courseId', studentController.addStudent);
router.put('/updateStudent/:studentId', studentController.updateStudent);
router.delete('/deleteStudent/:courseId/:studentId', studentController.deleteStudent);

module.exports = router;