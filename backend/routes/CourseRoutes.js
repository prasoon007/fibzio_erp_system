const express = require("express");
const router = express.Router();
const courseController = require('../controllers/course.controller');
const middlewareObj = require('../middlewares/validation');

router.get('/fetchAllCourses/:schoolId', courseController.apiFetchCourses);
router.post('/addCourse/:schoolId', middlewareObj.validateCoursePost, courseController.apiAddCourse);
router.put('/updateCourse/:courseId', middlewareObj.validateCoursePut, courseController.apiUpdateCourse);
router.delete('/deleteCourse/:schoolId/:courseId', courseController.apiDeleteCourse);


module.exports = router;