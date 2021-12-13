//TODO :- add authorization middleware -->>>>>> DONE ->>>>> Still some work is pending
//TODO :- think about fees logic 
//TODO :- add invoice generator <-----frontened pending----->
//TODO :- discuss about authorization with harsh

const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    PaytmChecksum = require('paytmchecksum'),
    { v4: orderIdGen } = require('uuid'),
    https = require('https'),
    multer = require('multer'),
    csv = require('fast-csv'),
    fs = require('fs'),
    course = require('./models/Course'),
    student = require('./models/Student');

//setting .env file
require('dotenv').config();

//directory setup
global.__basedir = __dirname;

//Setting up initials
connectToMongoDb();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

//*Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __basedir + '/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + "-" + Date.now() + "-" + file.originalname)
    }
})


//?csv filter layer
const csvFilter = (req, file, cb) => {
    file.mimetype.includes('csv') ? cb(null, true) :
        cb('Please upload csv file', false);
}

const upload = multer({ storage: storage, fileFilter: csvFilter });


//*ROUTES REGISTRATION
app.use('/', require('./routes/FeeRoutes'));
app.use('/', require('./routes/AdminRoutes'));
app.use('/', require('./routes/SchoolRoutes'));
app.use('/', require('./routes/StudentRoutes'));
app.use('/', require('./routes/CourseRoutes'));
app.use('/', require('./routes/AuthRoutes'));

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
    console.log(body);
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


//*CSV uploader route
app.post('/:courseId/csvUploader', upload.single('stCsv'), (req, res) => {
    try {
        if (req.file == undefined) return res.status(400).send({
            message: "Please upload a CSV"
        })
        let csvData = [];
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => {
                throw error.message;
            })
            .on('data', (row) => {
                csvData.push(row)
            })
            .on('end', async () => {
                try {
                    const foundCourse = await course.findById(req.params.courseId);
                    if (!foundCourse) return res.status(401).send({ message: "Course Not Found" });
                    csvData.map((data) => {
                        data.address = JSON.parse(data.address);
                        data.phone_number = JSON.parse(data.phone_number);
                        data.course_code = foundCourse.course_code;
                    })
                    student.insertMany(csvData, (err, docs) => {
                        if (err) return console.error(err)
                        else {
                            docs.map((doc) => {
                                foundCourse.students.push(doc);
                            })
                        }
                    })
                    console.log(csvData);
                } catch (error) {
                    res.status(500).send({
                        message: "Csv upload failed",
                        error: error.message
                    })
                }
            })
    } catch (error) {
        res.status(500).send({
            message: "Csv upload failed",
            error: error.message
        })
    }
})


//Server Start
app.listen(5000, () => {
    console.log('Started Successfully');
})