const adminServices = require('../services/adminService');

adminCtrl = {};

adminCtrl.apiAddAdmin = async (req, res, next) => {
    try {
        const data = req.body;
        const addedAdmin = await adminServices.createAdmin(data);
        !addedAdmin ? res.status(404).send('Admin add error') : res.send(addedAdmin);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

adminCtrl.apiUpdateAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const data = req.body;
        const updatedAdmin = await adminServices.updateAdmin(adminId, data);
        !updatedAdmin ? res.status(404).send('Admin update error') : res.send(updatedAdmin);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

adminCtrl.apiDeleteAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const deletedAdmin = await adminServices.deleteAdmin(adminId);
        !deletedAdmin ? res.status(404).send('Admin delete error') : res.send(deletedAdmin);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

module.exports = adminCtrl;
