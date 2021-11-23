const schoolServices = require('../services/schoolService');

schoolCtrl = {};

schoolCtrl.apiFetchSchool = async (req, res, next) => {
    try {
        const fetchedSchools = await schoolServices.fetchSchool();
        !fetchedSchools ? res.status(404).send('Schools fetch error') : res.send(fetchedSchools);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

schoolCtrl.apiFetchSchool_ss = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const fetchedSchool = await schoolServices.fetchSchool_ss(schoolId);
        !fetchedSchool ? res.status(404).send('School fetch error') : res.send(fetchedSchool);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }

}

schoolCtrl.apiAddSchool = async (req, res, next) => {
    try {
        const data = req.body;
        const addedSchool = await schoolServices.addSchool(data);
        !addedSchool ? res.status(404).send('School add error') : res.send(addedSchool);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

schoolCtrl.apiUpdateSchool = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const data = req.body;
        const updatedSchool = await schoolServices.updateSchool(schoolId, data);
        !updatedSchool ? res.status(404).send('School update error') : res.send(updatedSchool);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

schoolCtrl.apiDeleteSchool = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const deletedSchool = await schoolServices.deleteSchool(schoolId);
        !deletedSchool ? res.status(404).send('School delete error') : res.send(deletedSchool);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

module.exports = schoolCtrl;