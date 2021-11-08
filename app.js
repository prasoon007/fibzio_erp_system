const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    students = require('./models/Student');

connectToMongoDb();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const {name, email, password, course, dob, address, phone_number, student_status} = req.body;
    const student = await students.create({name, email, password , address, phone_number, student_status});
    res.send('hi');
})

app.listen(5000, () => {
    console.log('Started Successfully');
});