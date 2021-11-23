const express =  require("express");
const router = express.Router();
const schoolController = require('../controllers/school.controller');

router.get('/fetchSchools', schoolController.apiFetchSchool);
router.get('/fetchSchool_ss/:schoolId', schoolController.apiFetchSchool_ss);
router.post('/addSchool', schoolController.apiAddSchool);
router.put('/updateSchool/:schoolId', schoolController.apiUpdateSchool);
router.delete('/deleteSchool/:schoolId', schoolController.apiDeleteSchool);



module.exports = router;