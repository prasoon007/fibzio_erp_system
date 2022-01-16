const express =  require("express");
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const middleware = require("../middlewares/validation");

router.post('/addFees/:courseId', middleware.fetchUser, middleware.validateFeesPost, feeController.apiAddFees);
router.post('/addAddon/:studentId', middleware.fetchUser, feeController.apiAddAddon);
router.put('/updatedFees/:feeId', middleware.fetchUser, middleware.validateFeesPut, feeController.apiUpdateFees);
router.put('/updateAddon/:addonId', middleware.fetchUser, feeController.apiUpdateAddon);
router.delete('/deleteFees/:courseId/:feeId', middleware.fetchUser, feeController.apiDeleteFees);
router.delete('/deleteAddon/:studentId/:addonId', middleware.fetchUser, feeController.apiDeleteAddon);

module.exports = router;