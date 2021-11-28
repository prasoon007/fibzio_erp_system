const express =  require("express");
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const middleware = require("../middlewares");


router.post('/addFees/:courseId', middleware.validateFeesPost, feeController.apiAddFees);
router.put('/updatedFees/:feeId', middleware.validateFeesPutDelete, feeController.apiUpdateFees);
router.delete('/deleteFees/:courseId/:feeId', middleware.validateFeesPutDelete, feeController.apiDeleteFees);

module.exports = router;