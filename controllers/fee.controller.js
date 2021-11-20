const feeServices = require('../services/feeService');

const feeCtrl = {};

feeCtrl.apiAddFees = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const data = req.body;
        const addedFees = await feeServices.addFees(courseId, data);
        if (!addedFees) res.status(404).send('Adding fees failed');
        res.json(addedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}


feeCtrl.apiUpdateFees = async (req, res, next) => {
    try {
        const feeId = req.params.feeId;
        const data = req.body;
        const updatedFees = await feeServices.updateFees(feeId, data);
        if (!updatedFees) res.status(404).send('Fee Update Failed');
        res.send(updatedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}


feeCtrl.apiDeleteFees = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const feeId = req.params.feeid;
        const deletedFees = await feeServices.deleteFees(courseId.feeid);
        if (!deletedFees) res.status(404).send('Fee Deletion Failed');
        res.send(deletedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

module.exports = feeCtrl;