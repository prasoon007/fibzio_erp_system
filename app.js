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
    schools.find({}).populate('course').exec((err, allSchool) => {
        err ? res.send(err) :
            res.send(allSchool);
    });
});

app.post('/addSchool', async (req, res) => {
    const { school_name, username, password, school_code } = req.body;
    const school = await schools.create({ school_name, username, password, school_code });
    res.send(school);
})


// Course Routes

//fetch
app.get('/fetchAllCourse/:schoolId', (req, res) => {
    schools.findById(req.params.schoolId).populate('course').exec((err, foundSchool) => {
        err ? res.send(err) :
            res.send(foundSchool.course);
    });
})

//create
app.post('/addCourse/:schoolId', async (req, res) => {
    const { course_name, course_code, date, students_count } = req.body;
    schools.findById(req.params.schoolId, (err, foundSchool) => {
        err ? res.send(err) :
            courses.create({ course_name, course_code, date, students_count }, (err, addedCourse) => {
                err ? res.send(err) :
                    addedCourse.school_id = req.params.schoolId;
                foundSchool.course.push(addedCourse);
                foundSchool.save();
                res.send(addedCourse);
            })
    })
})

//Student Routes

//fetch 
app.get('/fetchStudents/:courseId', (req, res) => {
    courses.findByIdAndUpdate(req.params.courseId).populate('students').exec((err, foundStudents) => {
        err ? res.send(err) :
            res.send(foundStudents);
    })
});

//create
app.post('/addStudents/:courseId', (req, res) => {
    const { name, email, password, course_code, dob, address, phone_number, student_status, fee_status, parent } = req.body;
    courses.findById(req.params.courseId, (err, foundCourse) => {
        err ? res.send(err) :
            students.create({ name, email, password, course_code, dob, address, phone_number, student_status, fee_status, parent }, (err, addedStudent) => {
                err ? res.send(err) :
                    addedStudent.course_id = req.params.courseId;
                foundCourse.students.push(addedStudent);
                foundCourse.save();
                res.send(addedStudent);
            });
    })
});

//update
app.put('/updateStudent/:studentId', async (req, res) => {
    let updatedStudent = await students.findByIdAndUpdate(req.params.studentId, req.body);
    updatedStudent ? res.send(updatedStudent) : res.send('No matching students with your details')
})

//delete
app.delete('/deleteStudent/:courseId/:studentId', async (req, res) => {
    await students.findByIdAndDelete(req.params.studentId);
    let response = await courses.findByIdAndUpdate(req.params.courseId, { $pull: { students: req.params.studentId } });
    res.send(response);
});


app.listen(5000, () => {
    console.log('Started Successfully');
});