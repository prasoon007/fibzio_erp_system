const express =  require("express");
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const middleware = require("../middlewares/validation");


router.post('/addFees/:courseId', middleware.validateFeesPost, feeController.apiAddFees);
router.post('/addFees_SS/:studentId', feeController.apiAddFeesViaStudent);
router.put('/updateFees_SS/:studentId', feeController.updateFeesViaStudent);
router.put('/updatedFees/:feeId', middleware.validateFeesPut, feeController.apiUpdateFees);
router.delete('/deleteFees/:courseId/:feeId', feeController.apiDeleteFees);

module.exports = router;