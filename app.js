const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    students = require('./models/Student'),
    schools = require('./models/School'),
    courses = require('./models/Course');

connectToMongoDb();
app.use(cors());
app.use(express.json());


// School Routes
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

app.post('/addSchool', async (req, res) => {
    try {
        const school = await schools.create(req.body);
        res.send(school);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

// Course Routes

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
                    foundSchool.course.push(addedCourse);
                    foundSchool.save();
                    res.send(addedCourse);
                })
        })
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//Student Routes

//fetch 
app.get('/fetchStudents/:courseId', (req, res) => {
    try {
        courses.findByIdAndUpdate(req.params.courseId).populate('students').exec((error, foundStudents) => {
            error ? res.send(error) :
                res.send(foundStudents);
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
        let updatedStudent = await students.findByIdAndUpdate(req.params.studentId, req.body);
        updatedStudent ? res.send(updatedStudent) : res.send('No matching students with your details')
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
})

//delete
app.delete('/deleteStudent/:courseId/:studentId', async (req, res) => {
    try {
        await students.findByIdAndDelete(req.params.studentId);
        let response = await courses.findByIdAndUpdate(req.params.courseId, { $pull: { students: req.params.studentId } });
        res.send(response);
    } catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});


app.listen(5000, () => {
    console.log('Started Successfully');
});