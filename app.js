const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    students = require('./models/Student'),
    schools = require('./models/School'),
    courses = require('./models/Course'),
    admins = require('./models/Admin'),
    fees = require('./models/Fee');

connectToMongoDb();
app.use(cors());
app.use(express.json());


// School Routes

//fetch all schools
app.get('/fetchSchools', async (req, res) => {
    try {
        const allSchools = await schools.find({});
        if (!allSchools) return res.send('Invalid Request');
        res.send(allSchools);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});


//fetch specific school
app.get('/fetchSchool/:schoolId', async (req, res) => {
    try {
        const foundSchool = await schools.findById(req.params.schoolId);
        if (!foundSchool) return res.send('Invalid Request');
        res.send(foundSchool);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }

})

//create school route
app.post('/addSchool', async (req, res) => {
    try {
        const createdSchool = await schools.create(req.body);
        if (!createdSchool) return res.send('Invalid Request');
        res.send(createdSchool);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//update school route
app.put("/updateSchool/:schoolId", async (req, res) => {
    try {
        const foundSchool = await schools.findByIdAndUpdate(req.params.schoolId, req.body, { new: true }).select("-course");
        if (!foundSchool) return res.send('Invalid Request');
        res.send(foundSchool);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//NOT EFFICIENT School Delete Route
app.delete('/deleteSchool/:schoolId', async (req, res) => {
    const schoolId = req.params.schoolId;
    try {
        // find one school
        const findSchool = await schools.findOne({ _id: schoolId });
        if (!findSchool) return res.send('School Not Found');
        const findCourses = await courses.find({ _id: { $in: findSchool.course } });
        if (!findCourses) return res.send('Course Not Found');
        findCourses.map(async (course) => {
            const deletedStudents = await students.deleteMany({ _id: { $in: course.students } });
            if (!deletedStudents) return res.send('Students Not Deleted. Please Contact the Admin');
            const deletedFees = await fees.deleteMany({ _id: { $in: course.fee } });
            if (!deletedFees) return res.send('Course Fee Not Deleted. Please Contact the Admin');
            const deletedCourses = await courses.deleteMany({ _id: { $in: findSchool.course } });
            if (!deletedCourses) return res.send('Courses Not Deleted. Please Contact the Admin');
            const deletedSchool = await schools.deleteOne({ _id: schoolId });
            if (!deletedSchool) return res.send('School Deletion Failed. Please Contact the Admin');
            res.status(200).send('Deleted School Successfully');
        })
    } catch (error) {
        res.status(500).send('some error occured, ' + error.message);
    }
})

// COURSE ROUTE

//fetch
app.get('/fetchAllCourse/:schoolId', async (req, res) => {
    try {
        const foundSchool = schools.findById(req.params.schoolId).populate('course');
        if (!foundSchool) return res.send('Invalid Request');
        res.send(foundSchool.course);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//create
app.post('/addCourse/:schoolId', async (req, res) => {
    try {
        const foundSchool = await schools.findById(req.params.schoolId);
        if (!foundSchool) return res.send("Invalid Request");
        const addedCourse = await courses.create(req.body);
        if (!addedCourse) return res.send("Invalid Request");
        addedCourse.school_id = req.params.schoolId;
        addedCourse.save();
        foundSchool.course.push(addedCourse);
        foundSchool.save();
        res.send(addedCourse);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//update 
app.put('/updateCourse/:courseId', async (req, res) => {
    try {
        const updatedCourse = await courses.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        if (!updatedCourse) return res.send('Invalid Request');
        res.send(updatedCourse);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//delete
app.delete('/deleteCourse/:courseId', async (req, res) => {
    try {
        const deletedCourse = await courses.findByIdAndDelete(req.params.courseId);
        if (!deletedCourse) return res.send('Invalid Request');
        students.deleteMany({ _id: { $in: deletedCourse.students } });

    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//STUDENT ROUTE2

//fetch by ROLL NO
app.get('/fetchStudents_RR/:studentId', async (req, res) => {
    const foundStudent = await students.findById(req.params.studentId).select('name fee_status roll_number course_code');
    if (!foundStudent) return res.send('Invalid Request');
    res.json(foundStudent);
})
//fetch 
app.get('/fetchStudents/:courseId', async (req, res) => {
    try {
        const foundCourse = await courses.findById(req.params.courseId).populate('students');
        if (!foundCourse) return res.send('Invalid Request');
        res.send(foundCourse.students);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//create
app.post('/addStudents/:courseId', async (req, res) => {
    try {
        const foundCourse = await courses.findById(req.params.courseId);
        if (!foundCourse) return res.send("Invalid Request");
        const addedStudent = await students.create(req.body);
        if (!addedStudent) return res.send('Invalid Request');
        addedStudent.course_id = req.params.courseId;
        addedStudent.save();
        foundCourse.students.push(addedStudent);
        foundCourse.save();
        res.send(addedStudent);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//update
app.put('/updateStudent/:studentId', async (req, res) => {
    try {
        const updatedStudent = await students.findByIdAndUpdate(req.params.studentId, req.body, { new: true });
        if (!updatedStudent) return res.send('Invalid Request');
        res.send(updatedStudent);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//delete
app.delete('/deleteStudent/:courseId/:studentId', async (req, res) => {
    try {
        const deletedStudent = await students.findByIdAndDelete(req.params.studentId);
        if (!deletedStudent) return res.send('Invalid Request');
        const updatedCourse = await courses.findByIdAndUpdate(req.params.courseId, { $pull: { students: req.params.studentId } }, { new: true });
        res.status(200).send('Deleted');
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

// ADMIN ROUTE

//fetch admin
app.post('/createAdmin', async (req, res) => {
    try {
        const addedAdmin = await admins.create(req.body);
        (!addedAdmin) ? res.send('Invalid Request') : res.send(addedAdmin);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//update admin
app.put('/updateAdmin/:adminId', async (req, res) => {
    try {
        const updateAdmin = await admins.findByIdAndUpdate(req.params.adminId, req.body, { new: true });
        (!updateAdmin) ? res.send('Invalid Request') : res.json(updateAdmin);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//delete admin
app.delete('/deleteAdmin/:adminId', async (req, res) => {
    try {
        const deleteAdmin = await admins.findByIdAndDelete(req.params.adminId);
        (!deleteAdmin) ? res.send('Invalid Request') : res.send(deleteAdmin);
    } catch (error) {
        res.status(500).send('Some error occured,' + error.message);
    }
})

//FEE ROUTE

//add fees
app.post('/addFees/:courseId', async (req, res) => {
    try {
        const foundCourse = await courses.findById(req.params.courseId);
        if (!foundCourse) res.send('Invalid Request');
        const addedFee = await fees.create(req.body);
        foundCourse.fee.push(addedFee);
        foundCourse.save();
        res.send(addedFee);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//update fees

app.put('/updatedFees/:feeId', async (req, res) => {
    try {
        const updatedFees = await fees.findByIdAndUpdate(req.params.feeId, req.body, { new: true });
        (!updatedFees) ? res.send('Invalid Request') : res.send(updatedFees);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//delete fees

app.delete('/deleteFees/:courseId/:feeId', async (req, res) => {
    try {
        const deletedFees = await fees.findByIdAndDelete(req.params.feeId);
        if (!deletedFees) res.send('Invalid Request');
        const updatedCourse = await courses.findByIdAndUpdate(req.params.courseId, { $pull: { fee: req.params.feeId } }, { new: true });
        (!updatedCourse) ? res.send('Fee deletion from course failed') : res.send('Deleted Successfully');
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

app.listen(5000, () => {
    console.log('Started Successfully');
});