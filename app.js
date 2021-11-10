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

app.post('/', async (req, res) => {
    const { name, email, password, course, dob, address, phone_number, student_status } = req.body;
    const student = await students.create({ name, email, password, address, phone_number, student_status });
    res.send('hi');
})


// School Routes
app.get('/fetchSchools', (req, res) => {
    schools.find({}).populate('course').exec((err, allSchool) => {
        err ? res.send(err) :
            res.send(allSchool);
    });
});

app.post('/addSchool', async (req, res) => {
    const { school_name, school_code } = req.body;
    const school = await schools.create({ school_name, school_code });
    res.send(school);
})


// Course Routes
app.get('/fetchAllCourse/:schoolId', (req, res) => {
    schools.findById(req.params.schoolId).populate('course').exec((err, foundSchool) => {
        err ? res.send(err) :
            res.send(foundSchool.course);
    });
})

app.post('/addCourse/:schoolId', async (req, res) => {
    const { course_name, course_code, students_count } = req.body;
    schools.findById(req.params.schoolId, (err, foundSchool) => {
        err ? res.send(err) :
            courses.create({ course_name, course_code, students_count }, (err, addedCourse) => {
                err ? res.send(err) :
                    foundSchool.course.push(addedCourse);
                foundSchool.save();
                res.send(addedCourse);
            })
    })
})

//Student Routes
app.post('/addStudents/:courseId', async (req, res) => {
    const { name, email, password, course_code, dob, address, phone_number, student_status, fee_status, parent } = req.body;
    course.findById(req.params.courseId, (err, foundCourse) => {
        err ? res.send(err) :
            students.create({ name, email, password, course_code, dob, address, phone_number, student_status, fee_status, parent }, (err, addedStudent) => {
                err ? res.send(err) :
                    foundCourse.students.push(addedStudent);
                    foundCourse.sa
            });
    })
});

app.listen(5000, () => {
    console.log('Started Successfully');
});