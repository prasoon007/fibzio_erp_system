const express =  require("express");
const router = express.Router();
const feeController = require('../controllers/fee.controller');

router.post('/addFees/:courseId', feeController.apiAddFees);
router.put('/updatedFees/:feeId', feeController.apiUpdateFees);
router.delete('/deleteFees/:courseId/:feeId', feeController.apiDeleteFees);

module.exports = router;