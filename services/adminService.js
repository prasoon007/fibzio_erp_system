const admins = require('../models/Admin');

const adminService = {};

adminService.createAdmin = async (data) => {
    try {
        const addedAdmin = await admins.create(data);
        return addedAdmin;
    } catch (error) {
        console.log(`Admin add errror:  ${error}`)
    }
}

adminService.updateAdmin = async (adminId, data) => {
    try {
        const updateAdmin = await admins.findByIdAndUpdate(adminId, data, { new: true });
        return updateAdmin;
    } catch (error) {
        console.log(`Admin update error: ${error}`);
    }
}

adminService.deleteAdmin = async (adminId) => {
    try {
        const deleteAdmin = await admins.findByIdAndDelete(adminId);
        return deleteAdmin;
    } catch (error) {
        console.log(`Admin delete error: ${error}`);
    }
}

module.exports = adminService;