const express = require("express");
const router = express.Router();
const schoolController = require('../controllers/school.controller');
const middlewareObj = require('../middlewares/index');

router.get('/fetchSchools', schoolController.apiFetchSchool);
router.get('/fetchSchool_ss/:schoolId', schoolController.apiFetchSchool_ss);
router.post('/addSchool', middlewareObj.validateSchoolPost, schoolController.apiAddSchool);
router.put('/updateSchool/:schoolId', middlewareObj.validateSchoolPutDelete, schoolController.apiUpdateSchool);
router.delete('/deleteSchool/:schoolId', middlewareObj.validateSchoolPutDelete, schoolController.apiDeleteSchool);



module.exports = router;