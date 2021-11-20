const express =  require("express");
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/createAdmin', adminController.apiAddAdmin);
router.put('/updateAdmin/:adminId', adminController.apiUpdateAdmin);
router.delete('/deleteAdmin/:adminId', adminController.apiDeleteAdmin);

module.exports = router;