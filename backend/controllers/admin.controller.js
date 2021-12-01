const adminServices = require('../services/adminService'),
    middleware = require('../middlewares/validation'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

adminCtrl = {};

adminCtrl.apiAdminCtrl = async (req, res) => {
    try {
        const { username, password } = req.body;
        let salt = await bcrypt.genSalt(10); //generates salt 
        const secPass = await bcrypt.hash(password, salt); //generates hashed password
        let addedAdmin = await adminServices.createAdmin(username, secPass);
        (!addedAdmin) ? res.send(404).send('Admin creation error'):res.send({addedAdmin});
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

adminCtrl.apiUpdateAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const data = req.body;
        const updatedAdmin = await adminServices.updateAdmin(adminId, data);
        !updatedAdmin ? res.status(404).send('Admin update error') : res.send(updatedAdmin);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

adminCtrl.apiDeleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const deletedAdmin = await adminServices.deleteAdmin(adminId);
        !deletedAdmin ? res.status(404).send('Admin delete error') : res.send(deletedAdmin);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

module.exports = adminCtrl;

