const express =  require("express");
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const middlewareObj = require('../middlewares/validation')

router.post('/createAdmin', middlewareObj.validateAdminPostSchoolAuth, adminController.apiCreateAdmin);
router.put('/updateAdmin/:adminId', middlewareObj.validateAdminPut, adminController.apiUpdateAdmin);
router.delete('/deleteAdmin/:adminId', adminController.apiDeleteAdmin);

module.exports = router;