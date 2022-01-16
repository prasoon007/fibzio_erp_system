const express =  require("express");
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const middleware = require('../middlewares/validation')

router.post('/createAdmin', middleware.fetchUser, middleware.validateAdminPostSchoolAuth, adminController.apiCreateAdmin);
router.put('/updateAdmin/:adminId', middleware.fetchUser, middleware.validateAdminPut, adminController.apiUpdateAdmin);
router.delete('/deleteAdmin/:adminId', middleware.fetchUser, adminController.apiDeleteAdmin);

module.exports = router;