//TODO :- make course code unique in particular school
//TODO :- make middlewares
//TODO:- make payment gateway integration
//TODO:- integrate validation on each create(school, course, fees, student) route

const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    { body, validationResult } = require('express-validator'),
    jwt = require('jsonwebtoken'),
    admins = require('./models/Admin'),
    students = require('./models/Student'),
    schools = require('./models/School'),
    bcrypt = require('bcryptjs'),
    PaytmChecksum = require('paytmchecksum'),
    { v4: orderIdGen } = require('uuid'),
    qs = require('querystring'),
    https = require('https');

require('dotenv').config();
//Setting up initials
connectToMongoDb();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));


//ROUTES REGISTRATION
app.use('/', require('./routes/FeeRoutes'));
app.use('/', require('./routes/AdminRoutes'));
app.use('/', require('./routes/SchoolRoutes'));
app.use('/', require('./routes/StudentRoutes')); //fetching students through school id broken
app.use('/', require('./routes/CourseRoutes'));

//ADMIN AND SCHOOL ROUTE
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
        if (authLev == 0) user = await admins.findOne({ username }).select('+password');
        else if (authLev == 1) user = await schools.findOne({ username }).select('+password');
        if (!user) return res.status(400).send({ success, error: 'Invalid Credentials' });
        //after finding user, we are verifying req.body.password(hash) from password hash from database
        let passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) return res.status(400).json({ success, error: 'Invalid Password Credentials' });
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

//STUDENT AND PARENT LOGIN ROUTE
app.post('/auth/loginCred', [
    body('email', 'please enter valid email').isEmail(),
    body('password', 'please valid password').not().isEmpty().isLength({ min: 8 }),
    body('authLev', 'Requirement error').not().isEmpty()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() }); //return error + json
    }
    try {
        const { email, password, authLev } = req.body;
        let user = await students.findOne({ email }).select('+password');
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
        res.status(500).json('Internal Server Error ' + error.message);
    }
})

//paytm integration
app.post('/paymentGateway/payTm', (req, res) => {
    const { email, amount } = req.body;
    var params = {};

    params['MID'] = process.env.mid,
        params['WEBSITE'] = process.env.website,
        params['CHANNEL_ID'] = process.env.channelIdWeb,
        params['INDUSTRY_TYPE_ID'] = process.env.industryType,
        params['ORDER_ID'] = orderIdGen(),
        params['CUST_ID'] = email,
        params['TXN_AMOUNT'] = JSON.stringify(amount)
    params['CALLBACK_URL'] = 'http://localhost:5000/paymentResponse'


    var paytmChecksum = PaytmChecksum.generateSignature(params, process.env.mkey);
    paytmChecksum.then(function (result) {
        let paytmParams = {
            ...params,
            "CHECKSUMHASH": result
        }
        res.json(paytmParams)
    }).catch(function (error) {
        res.status(500).json('Internal Server Error ' + error.message);
    });
});


//! paytm ka response idhar ata h bhai
app.post('/paymentResponse', (req, res, next) => {
    let body = {
        ORDERID: req.body.ORDERID,
        MID: req.body.MID,
        TXNID: req.body.TXNID,
        TXNAMOUNT: req.body.TXNAMOUNT,
        PAYMENTMODE: req.body.PAYMENTMODE,
        CURRENCY: req.body.CURRENCY,
        TXNDATE: req.body.TXNDATE,
        STATUS: req.body.STATUS,
        RESPCODE: req.body.RESPCODE,
        RESPMSG: req.body.RESPMSG,
        GATEWAYNAME: req.body.GATEWAYNAME,
        BANKTXIND: req.body.BANKTXNID,
        BANKNAME: req.body.BANKNAME,
        CHECKSUMHASH: req.body.CHECKSUMHASH
    }
    const paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;
    var isVerifySignature = PaytmChecksum.verifySignature(body, process.env.mkey, paytmChecksum);
    if (isVerifySignature) {
        var paytmParams = {};
        paytmParams.body = {
            "mid": body.MID,
            "orderId": body.ORDERID
        };
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.mkey).then(function (checksum) {
            paytmParams.head = {
                "signature": checksum
            };
            var post_data = JSON.stringify(paytmParams);

            var options = {

                /* for Staging */
                hostname: 'securegw-stage.paytm.in',

                /* for Production */
                // hostname: 'securegw.paytm.in',

                port: 443,
                path: '/v3/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            // Set up the request
            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function () {
                    res.send(response);
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });


    } else {
        console.log("Checksum Mismatched");
    }
});

//Server Start
app.listen(5000, () => {
    console.log('Started Successfully');
})