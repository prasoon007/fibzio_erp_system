const courseServices = require('../services/courseService');

const courseCtrl = {};

courseCtrl.apiFetchCourses = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const fetchedCourses = await courseServices.fetchCourses(schoolId);
        !fetchedCourses ? res.status(404).send('School fetch error') : res.send(fetchedCourses);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

courseCtrl.apiAddCourse = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const data = req.body;
        const addedCourse = await courseServices.addCourse(schoolId, data);
        !addedCourse ? res.status(404).send('School add error') : res.send(addedCourse);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

courseCtrl.apiUpdateCourse = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const data = req.body;
        const updatedCourse = await courseServices.updateCourse(courseId, data);
        !updatedCourse ? res.send(404).send('School update error') : res.send(updatedCourse);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

courseCtrl.apiDeleteCourse = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const courseId = req.params.courseId;
        const deletedCourse = await courseServices.deleteCourse(schoolId, courseId);
        !deletedCourse ? res.status(404).send('School delete error') : res.send(deletedCourse);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
}

module.exports = courseCtrl;