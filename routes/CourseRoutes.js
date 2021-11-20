const express =  require("express");
const router = express.Router();
const courseController = require('../controllers/course.controller');

router.get('/fetchAllCourses/:schoolId', courseController.apiFetchCourses);
router.post('/addCourse/:schoolId', courseController.apiAddCourse);
router.put('/updateCourse/:courseId', courseController.apiUpdateCourse);
router.delete('/deleteCourse/:schoolId/:courseId', courseController.apiDeleteCourse);


module.exports = router;