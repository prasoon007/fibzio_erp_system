//TODO :- add authorization middleware -->>>>>> DONE ->>>>> Still some work is pending
//TODO :- think about fees logic 
//TODO :- add csv handler
//TODO :- add invoice generator
//TODO :- discuss about authorization with harsh

const express = require('express'),
    app = express(),
    connectToMongoDb = require('./db'),
    cors = require('cors'),
    PaytmChecksum = require('paytmchecksum'),
    { v4: orderIdGen } = require('uuid'),
    https = require('https');

//setting .env file
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

//Server Start
app.listen(5000, () => {
    console.log('Started Successfully');
})