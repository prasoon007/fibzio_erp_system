const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors');
    // students = require('./models/Student'),
    // schools = require('./models/School'),
    // courses = require('./models/Course');
    // admins = require('./models/Admin'),
    // fees = require('./models/Fee');


connectToMongoDb();
app.use(cors());
app.use(express.json());

//ROUTES REGISTRATION
app.use('/', require('./routes/FeeRoutes'));
app.use('/', require('./routes/AdminRoutes'));
app.use('/', require('./routes/SchoolRoutes'));
app.use('/', require('./routes/StudentRoutes'));
app.use('/', require('./routes/CourseRoutes'));

app.listen(5000, () => {
    console.log('Started Successfully');
});