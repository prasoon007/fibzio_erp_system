const express = require("express");
const router = express.Router();
const schoolController = require('../controllers/school.controller');
const middleware = require('../middlewares/validation');

router.get('/fetchSchools', middleware.fetchUser, schoolController.apiFetchSchool);
router.get('/fetchSchool_ss/:schoolId', schoolController.apiFetchSchool_ss);
router.post('/addSchool', middleware.validateSchoolPost, schoolController.apiAddSchool);
router.put('/updateSchool/:schoolId', middleware.validateSchoolPut, schoolController.apiUpdateSchool);
router.delete('/deleteSchool/:schoolId', schoolController.apiDeleteSchool);



module.exports = router;