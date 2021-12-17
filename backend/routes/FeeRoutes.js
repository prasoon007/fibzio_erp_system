const express =  require("express");
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const middleware = require("../middlewares/validation");


router.post('/addFees/:courseId', middleware.validateFeesPost, feeController.apiAddFees);
router.post('/addAddon/:studentId', feeController.apiAddAddon);
router.put('/updatedFees/:feeId', middleware.validateFeesPut, feeController.apiUpdateFees);
router.put('/updateAddon/:addonId', feeController.apiUpdateAddon);
router.delete('/deleteFees/:courseId/:feeId', feeController.apiDeleteFees);
router.delete('/deleteAddon/:studentId/:addonId', feeController.apiDeleteAddon);

module.exports = router;