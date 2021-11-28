const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const middlewareObj = require('../middlewares');

router.post('/auth/adminSchoolLogin', middlewareObj.validateAdminPostSchoolAuth, authController.apiAuthAdminSchoolLogin);
router.post('/auth/loginCred', middlewareObj.validateStudentParentAuth, authController.apiAuthStudentParentLogin);

module.exports = router;