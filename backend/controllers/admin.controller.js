const adminServices = require('../services/adminService'),
    middleware = require('../middlewares/index'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

adminCtrl = {};

adminCtrl.apiAdminCtrl = async (req, res, next) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let authLev = req.body.authLev

        let salt = await bcrypt.genSalt(10); //generates salt 
        const secPass = await bcrypt.hash(password, salt); //generates hashed password
        let addedAdmin = await adminServices.createAdmin(username, secPass);
        if (!addedAdmin) res.send(404).send('Admin creation error');
        //setting up authToken
        const data = {
            user: {
                id: addedAdmin.id,
                authLev: authLev
            }
        }
        //auth token is generated using data and secret string
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ success: true, authToken });//here using es6 authtoken is being send
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

