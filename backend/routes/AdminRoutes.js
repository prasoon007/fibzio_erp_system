const express =  require("express");
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const middlewareObj = require('../middlewares/index')

router.post('/createAdmin', middlewareObj.validateAdminPostSchoolAuth, adminController.apiAdminCtrl);
router.put('/updateAdmin/:adminId', middlewareObj.validateAdminPutDeleteSchoolAuth, adminController.apiUpdateAdmin);
router.delete('/deleteAdmin/:adminId', middlewareObj.validateAdminPutDeleteSchoolAuth, adminController.apiDeleteAdmin);

module.exports = router;