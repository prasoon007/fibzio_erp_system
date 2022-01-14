const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const middlewareObj = require('../middlewares/validation');

router.post('/auth/adminLogin', middlewareObj.validateAdminPostSchoolAuth, authController.apiAuthAdminLogin);
router.post('/auth/schoolLogin', middlewareObj.validateAdminPostSchoolAuth, authController.apiAuthSchoolLogin);
router.post('/auth/loginCred', middlewareObj.validateStudentParentAuth, authController.apiAuthStudentParentLogin);

module.exports = router;