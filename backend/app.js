//TODO :- add authorization middleware -->>>>>> DONE ->>>>> Still some work is pending
//TODO :- think about fees logic 
//TODO :- discuss about authorization with harsh
//TODO :- Think About Fees Logic
//TODO :- Roll_Number Generation
//TODO :- Late Fees Updater
//TODO :- Instamojo and razor pay adder

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
    Razorpay = require('razorpay'),
    course = require('./models/Course'),
    Insta = require('instamojo-nodejs'),
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
app.post('/paytmPaymentResponse', (req, res, next) => {
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

//*instamojo gateway integration
app.post('/paymentGateway/instamojo', (req, res) => {
    Insta.setKeys('d6bdf8b8f90dc601dd05f24856fc6058', '422744018a27c6b4fc7d9cc973691dd9');
    const data = new Insta.PaymentData();
    Insta.isSandboxMode(true);
    const { purpose, amount, buyer_name, email, phone } = req.body;

    data.purpose = purpose;
    data.amount = amount;
    data.currency = 'INR';
    data.buyer_name = buyer_name;
    data.email = email;
    data.phone = phone;
    data.send_sms = 'False';
    data.send_email = 'False';
    data.allow_repeated_payments = 'False';
    data.webhook = "http://www.example.com/webhook/";
    data.redirect_url = 'http://localhost:5000/instamojoPaymentResponse';

    Insta.createPayment(data, function (error, response) {
        if (error) {
            // some error
        } else {
            // Payment redirection link at response.payment_request.longurl
            const responseData = JSON.parse(response);
            const redirect_url = responseData.payment_request.longurl;
            console.log(redirect_url);
        }
    });
});

//instamojo response
app.get('/instamojoPaymentResponse', (req, res) => {
    res.send('hi');
});

app.post('/razorpayPaymentGateway', (req, res) => {
    const { amount } = req.body;

    const instance = new Razorpay({
        key_id: 'rzp_test_RkhBeNfVFky2jx',
        key_secret: '37wzbei9Mbkf7oV9IdWddy1k',
    });

    var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_1"
    };
    instance.orders.create(options, function (err, order) {
        err ? console.log(err) : console.log(order);
    });
})

//razor pay response and verification
app.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
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
                            foundCourse.save();
                            res.status(200).send("CSV Uploaded successFully");
                        }
                    })
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