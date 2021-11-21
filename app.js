const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    { body, validationResult } = require('express-validator'),
    jwt = require('jsonwebtoken'),
    admins = require('./models/Admin'),
    bcrypt = require('bcryptjs');


const studentService = require('./services/studentService');


require('dotenv').config();
//Setting up initials
connectToMongoDb();
app.use(cors());
app.use(express.json());

//ROUTES REGISTRATION
app.use('/', require('./routes/FeeRoutes'));
app.use('/', require('./routes/AdminRoutes'));
app.use('/', require('./routes/SchoolRoutes'));
app.use('/', require('./routes/StudentRoutes')); //fetching students through school id broken
app.use('/', require('./routes/CourseRoutes'));

app.post('/auth/createAdmin', [
    body('username', 'enter a valid email').not().isEmpty().isLength({ min: 8 }),
    body('password', 'enter a valid pass').not().isEmpty().isLength({ min: 8 }),
    body('authLev', 'Requirement error').not().isEmpty()
], async (req, res) => {
    let success;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() }); //return error + json
    }
    try {
        let salt = await bcrypt.genSalt(10); //generates salt 
        const secPass = await bcrypt.hash(req.body.password, salt); //generates hashed password
        //user is added to databse using .create()
        let admin = await admins.create({
            username: req.body.username,
            password: secPass,
            authLev: req.body.authLev,
        })
        //setting up authToken
        const data = {
            user: {
                id: admin.id,
                authLev: admin.authLev
            }
        }
        //auth token is generated using data and secret string
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authToken });//here using es6 authtoken is being send
    }
    catch (error) {
        res.status(500).send('some error occured,' + error.message);
    }
});

app.post('/auth/adminSchoolLogin', [
    body('username', 'please enter valid username').not().isEmpty().isLength({ min: 8 }),
    body('password', 'please enter valid pass').not().isEmpty().isLength({ min: 8 }),
    body('authLev', 'Requirement error').not().isEmpty()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { username, password, authLev } = req.body; //destructuring email and pass from req.body
    try {
        // finding user from req.body.email from database
        if (authLev == 0) user = await admins.findOne({ username });
        else if (authLev == 1) user = await admins.findOne({ username });
        if (!user) return res.status(400).send({ success, error: 'Invalid Credentials' });
        //after finding user, we are verifying req.body.password(hash) from password hash from database
        let passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) return res.status(400).json({ success, error: 'Password Credentials' });
        //setting up jwt using user id and authLev
        const data = {
            user: {
                id: user.id,
                authLev: user.authLev
            }
        }
        let authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        res.status(500).json('Internal Server Error' + error.message);
    }
})

//first we need to decide how to create student and also parent login is still pending
// app.post('/auth/createCred', [
//     body('email', 'please enter valid email').isEmail().not().isEmpty(),
//     body('password', 'please enter valid pass').isLength({ min: 8 }).not().isEmpty(),
//     body('authLev', 'Requirement error').not().isEmpty()
// ], async (req, res) => {
//     let success = false;
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ success, errors: errors.array() }); //return error + json
//     }
//     try {
//         let salt = await bcrypt.genSalt(10); //generates salt 
//         const secPass = await bcrypt.hash(req.body.password, salt); //generates hashed password
//         let user = await students.create({
//             email: req.body.email,
//             password: secPass,
//             authLev: req.body.authLev
//         })
//         const data = {
//             user: {
//                 id: user.id,
//                 authLev: user.authLev
//             }
//         }
//         let authToken = jwt.sign(data, process.env.JWT_SECRET);
//         success = true;
//         res.json({ success, authToken });
//     } catch (error) {
//         res.status(500).json('Internal Server Error' + error.message);
//     }
// })

app.post('/auth/loginCred', [
    body('email', 'please enter valid email').isEmail(),
    body('password', 'please valid password').not().isEmpty().isLength({ min: 8 }),
    body('authLev', 'Requirement error').not().isEmpty()
], async (req, res) => {
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() }); //return error + json
    }
    try {
        let user = await students.findOne({ email });
        if (!user) return res.status(400).send({ success, error: 'Invalid Credentials' });
        //after finding user, we are verifying req.body.password(hash) from password hash from database
        let passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) return res.status(400).json({ success, error: 'Password Credentials' });
        //setting up jwt using user id and authLev
        const data = {
            user: {
                id: user.id,
                authLev: user.authLev
            }
        }
        let authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        res.status(500).json('Internal Server Error' + error.message);
    }
})
//Server Start
app.listen(5000, () => {
    console.log('Started Successfully');
});