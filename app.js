const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    students = require('./models/Student'),
    schools = require('./models/School');

connectToMongoDb();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const {name, email, password, course, dob, address, phone_number, student_status} = req.body;
    const student = await students.create({name, email, password , address, phone_number, student_status});
    res.send('hi');
})

app.post('/addSchool', async (req, res) => {
    const {name, school_code} = req.body;
    const school = await schools.create({name, school_code});
    res.send(school);
})

app.listen(5000, () => {
    console.log('Started Successfully');
});