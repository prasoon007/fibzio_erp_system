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
app.get('/fetchSchools', (req, res) => {
    try {
        schools.find({}).populate('course').exec((error, allSchool) => {
            error ? res.send(error) :
                res.send(allSchool);
        });
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});


//fetch specific school
app.get('/fetchSchool/:schoolId', async (req, res) => {
    try {
        const foundSchool = await schools.findById(req.params.schoolId).populate('course');
        foundSchool ? res.send(foundSchool) : res.send("Invalid School Code");
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//create school route
app.post('/addSchool', async (req, res) => {
    try {
        const school = await schools.create(req.body);
        res.send(school);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//update school route
app.put("/updateSchool/:schoolId", async (req, res) => {
    try {
        const foundSchool = await schools.findByIdAndUpdate(req.params.schoolId, req.body, {new:true}).populate('course');
        foundSchool ? res.send(foundSchool) : res.send("Invalid School Code");
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//delete school route
app.delete("/fetchSchool/:schoolId", async (req, res) => {
    try {
        const deletedSchool = await schools.findByIdAndDelete(req.params.schoolId).populate('course');
        console.log(deletedSchool)
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

// if(!deletedSchool)res.send('Invalid Request');
// const deleteCourse = await courses.deleteMany({_id: {$in: deletedSchool.course}});
// console.log(deleteCourse);
// const removedStudents = await students.deleteMany({_id: {$in: deletedSchool.course.students}});
// if(!removedStudents)res.send('Invalid Request');
// console.log(removedStudents);

// COURSE ROUTE

//fetch
app.get('/fetchAllCourse/:schoolId', (req, res) => {
    try {
        schools.findById(req.params.schoolId).populate('course').exec((error, foundSchool) => {
            error ? res.send(error) :
                res.send(foundSchool.course);
        });
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//create
app.post('/addCourse/:schoolId', async (req, res) => {
    try {
        schools.findById(req.params.schoolId, (error, foundSchool) => {
            error ? res.send(error) :
                courses.create(req.body, (error, addedCourse) => {
                    error ? res.send(error) :
                        addedCourse.school_id = req.params.schoolId;
                    addedCourse.save();
                    foundSchool.course.push(addedCourse);
                    foundSchool.save();
                    res.send(addedCourse);
                })
        })
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//update 
app.put('/updateCourse/:courseId', async (req, res) => {
    try {
        const updatedCourse = await courses.findByIdAndUpdate(req.params.courseId, req.body, {new:true});
        (!updatedCourse) ? res.send('Invalid Request') :
            res.send(updatedCourse);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//delete
app.delete('/deleteCourse/:courseId', async (req, res) => {
    try {
        const deletedCourse = await courses.findByIdAndDelete(req.params.courseId);
        if (!deletedCourse) res.send('Invalid Request');
        students.deleteMany({ _id: { $in: deletedCourse.students } });

    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//STUDENT ROUTE

//fetch 
app.get('/fetchStudents/:courseId', (req, res) => {
    try {
        courses.findById(req.params.courseId).populate('students').exec((error, foundCourse) => {
            error ? res.send(error) :
                res.send(foundCourse.students);
        })
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//create
app.post('/addStudents/:courseId', (req, res) => {
    try {
        courses.findById(req.params.courseId, (error, foundCourse) => {
            error ? res.send(error) :
                students.create(req.body, (error, addedStudent) => {
                    error ? res.send(error) :
                        addedStudent.course_id = req.params.courseId;
                    addedStudent.save();
                    foundCourse.students.push(addedStudent);
                    foundCourse.save();
                    res.send(addedStudent);
                });
        })
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//update
app.put('/updateStudent/:studentId', async (req, res) => {
    try {
        const updatedStudent = await students.findByIdAndUpdate(req.params.studentId, req.body, {new:true});
        updatedStudent ? res.send(updatedStudent) : res.send('No matching students with your details')
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//delete
app.delete('/deleteStudent/:courseId/:studentId', async (req, res) => {
    try {
        await students.findByIdAndDelete(req.params.studentId);
        let response = await courses.findByIdAndUpdate(req.params.courseId, { $pull: { students: req.params.studentId } }, {new:true});
        res.send("DELETED SUCCESSFULLY");
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
        const updateAdmin = await admins.findByIdAndUpdate(req.params.adminId, req.body, {new:true});
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
        res.send(addedFee);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

//update fees

app.put('/updatedFees/:feeId', async (req, res) => {
    try {
        const updatedFees = await fees.findByIdAndUpdate(req.params.feeId, req.body, {new:true});
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
        const updatedCourse = await courses.findByIdAndUpdate(req.params.courseId, { $pull: { fee: req.params.feeId } }, {new:true});
        (!updatedCourse) ? res.send('Fee deletion from course failed') : res.send('Deleted Successfully');
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

app.listen(5000, () => {
    console.log('Started Successfully');
});