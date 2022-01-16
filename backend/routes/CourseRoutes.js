const express = require("express");
const router = express.Router();
const courseController = require('../controllers/course.controller');
const middlewareObj = require('../middlewares/validation');

router.get('/fetchAllCourses/:schoolId', middlewareObj.fetchUser, courseController.apiFetchCourses);
router.post('/addCourse/:schoolId', middlewareObj.fetchUser, middlewareObj.validateCoursePost, courseController.apiAddCourse);
router.put('/updateCourse/:courseId', middlewareObj.fetchUser, middlewareObj.validateCoursePut, courseController.apiUpdateCourse);
router.delete('/deleteCourse/:schoolId/:courseId', middlewareObj.fetchUser, courseController.apiDeleteCourse);

module.exports = router;