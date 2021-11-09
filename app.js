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
app.post('/addSchool', async (req, res) => {
    const { school_name, school_code } = req.body;
    const school = await schools.create({ school_name, school_code });
    res.send(school);
})


// Course Routes
app.post('/addSchool/addCourse/:id', async (req, res) => {
    const {course_name, course_id, students_count} = req.body;
    schools.findById(req.params.id, (err, foundSchool) => {
        err ? res.send(err): 
        courses.create({course_name, course_id, students_count}, (err, addedCourse) => {
            foundSchool.course.push(addedCourse);
            foundSchool.save();
            res.send(foundSchool);
        })
    })
})

app.listen(5000, () => {
    console.log('Started Successfully');
});