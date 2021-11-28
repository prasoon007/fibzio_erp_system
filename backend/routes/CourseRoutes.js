const express = require("express");
const router = express.Router();
const courseController = require('../controllers/course.controller');
const middlewareObj = require('../middlewares/index');

router.get('/fetchAllCourses/:schoolId', courseController.apiFetchCourses);
router.post('/addCourse/:schoolId', middlewareObj.validateCoursePost, courseController.apiAddCourse);
router.put('/updateCourse/:courseId', middlewareObj.validateCoursePutDelete, courseController.apiUpdateCourse);
router.delete('/deleteCourse/:schoolId/:courseId', middlewareObj.validateCoursePutDelete, courseController.apiDeleteCourse);


module.exports = router;