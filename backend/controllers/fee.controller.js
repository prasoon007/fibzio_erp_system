const feeServices = require('../services/feeService');

const feeCtrl = {};

feeCtrl.apiAddFees = async (req, res) => {
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


feeCtrl.apiUpdateFees = async (req, res) => {
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


feeCtrl.apiDeleteFees = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const feeId = req.params.feeid;
        const deletedFees = await feeServices.deleteFees(courseId, feeId);
        if (!deletedFees) res.status(404).send('Adding Fees Failed(SS)');
        res.send(deletedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

feeCtrl.apiAddFeesViaStudent = async (req, res) => {
    try {
        const data = req.body;
        const studentId = req.params.studentId;
        const addedFees = await feeServices.addFees_SS(studentId, data)
        if (!addedFees) res.status(404).send('Adding Fees Failed(SS)');
        res.send(addedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

feeCtrl.apiUpdateFeesViaStudent = async () => {
    try {
        const data = req.body;
        const studentId = req.params.studentId;
        const updatedFees = await feeServices.updateFees_SS(studentId, data)
        if (!updatedFees) res.status(404).send('Fee Update Failed(SS)');
        res.send(updatedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

feeCtrl.apiDeleteFeesViaStudent = async () => {
    try {
        const studentId = req.params.studentId;
        const deletedFees = await feeServices.deleteFees_SS(studentId)
        if (!deletedFees) res.status(404).send('Fee Deletetion Failed(SS)');
        res.send(deletedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

module.exports = feeCtrl;