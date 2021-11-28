const jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    { body, validationResult } = require('express-validator');


require('dotenv').config();

const middleware = {};

middleware.fetchUser = (req, res, next) => {
    const token = req.header('auth-token'); //recieving header from req.header
    if (!token) return res.status(401).json({ "error1": "Please Enter a valid token" });
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET); //verifying token and extracting user.id back from it back.

        //storing extracted info from token to req.user which is passed on the next function
        req.user = data.user
        next(); //used to execute next funct specified in the route ex:- (req, res)
    } catch (error) {
        return res.status(401).json({ "error2": "Please Enter a valid token" });
    }
}
middleware.validateAdminPostSchoolAuth = [
    body('username', 'Min length is 8').trim().not().isEmpty().isLength({ min: 8 }),
    body('password', 'Strong password required').trim().not().isEmpty().isStrongPassword(),
    body('authLev', 'Requirement error').trim().not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
];

middleware.validateAdminPutDeleteSchoolAuth = [
    body('username', 'Min length is 8').trim().isLength({ min: 8 }),
    body('password', 'Strong password required').trim().isStrongPassword(),
    body('authLev', 'Requirement error').trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
];

middleware.validateStudentParentAuth = [
    body('email', 'Enter valid email').trim().isEmail(),
    body('password', 'Min lenght is 8').trim().not().isEmpty().isStrongPassword().withMessage('Must be combination of lowercase, uppercase and special characters'),
    body('authLev', 'Requirement error').trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
];

middleware.validateSchoolPost = [
    body('school_name', 'Min length is 8').trim().not().isEmpty().isLength({ min: 8 }),
    body('username', 'Min lenght is 8').trim().not().isEmpty().isLength({ min: 8 }),
    body('password').trim().not().isEmpty().withMessage('Password Required').isStrongPassword().withMessage('Password must have lower,uppercase and special characters'),
    body('school_code', 'School code is required').trim().not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
]


middleware.validateSchoolPutDelete = [
    body('school_name', 'Min length is 8').trim().isLength({ min: 8 }),
    body('username', 'Min lenght is 8').trim().isLength({ min: 8 }),
    body('password').trim().isStrongPassword().withMessage('Password must have lower,uppercase and special characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
]

middleware.validateCoursePost = [
    body('course_name', 'Min length is 8').trim().not().isEmpty().isLength({ min: 3 }),
    body('course_code', 'Length between 8 and 12 allowed').trim().not().isEmpty().isLength({ min: 8, max: 12 }),
    body('date.start_date', 'Must be in date format').trim().isDate(),
    body('date.end_date', 'Must be in date format').trim().isDate(),
    body('students_count', 'Required and Numeric value allowed only').trim().not().isEmpty().isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
];

middleware.validateCoursePutDelete = [
    body('course_name', 'Min length is 8').trim().isLength({ min: 3 }),
    body('course_code', 'Length between 8 and 12 allowed').trim().isLength({ min: 8, max: 12 }),
    body('date.start_date', 'Must be in date format').trim().isDate(),
    body('date.end', 'Must be in date format').trim().isDate(),
    body('students_count', 'Numeric value allowed only').trim().isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
];


middleware.validateStudentPost = [
    body('name', 'Name required').trim().not().isEmpty(),
    body('email', 'Enter valid email').trim().not().isEmpty().isEmail(),
    body('password', 'Strong password required').trim().not().isEmpty().isStrongPassword(),
    body('course_code', 'Required and should be numeric').trim().not().isEmpty().isNumeric(),
    body('dob', 'Must be in date format').trim().not().isEmpty().isDate(),
    body('address', 'Required').trim().not().isEmpty(),
    body('phone_number', 'Enter a valid phone number').trim().not().isEmpty().isMobilePhone(),
    body('student_status', 'Student status required').default('Regular'),
    body('parent.fathers_name', 'Fathers name required').trim().not().isEmpty(),
    body('parent.mothers_name', 'Mothers name equired').trim().not().isEmpty(),
    body('parent.mob_number', 'Enter a valid phone number').trim().not().isEmpty().isMobilePhone(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
]


middleware.validateStudentPutDelete = [
    body('email', 'Enter valid email').trim().isEmail(),
    body('password', 'Must be between 8 to 12 characters').trim().isLength({ min: 8, max: 12 }),
    body('course_code', 'Required and should be numeric').trim().isNumeric(),
    body('dob', 'Must be in date format').trim().isDate(),
    body('phone_number', 'Enter a valid phone number').trim().isMobilePhone(),
    body('parent.fathers_name', 'Fathers name required'),
    body('parent.mob_number', 'Enter a valid phone number').trim().isMobilePhone(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
]


middleware.validateFeesPost = [
    body('course_name', 'Course name is required').trim().not().isEmpty(),
    body('total_fees', 'Required and must be numeric').trim().not().isEmpty().isNumeric(),
    body('breakup', 'Required').trim().isNumeric(),
    body('deadline_date', 'Must be in date format').trim().isDate(),
    body('min_amount_allowed', 'Required and must be numeric').trim().not().isEmpty().isNumeric(),
    body('relaxation', 'Required and must be numeric').trim().not().isEmpty().isNumeric(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
]


middleware.validateFeesPutDelete = [
    body('course_name', 'Course name is required').trim(),
    body('total_fees', 'Required and must be numeric').trim().isNumeric(),
    body('min_amount_allowed', 'Required and must be numeric').trim().isNumeric(),
    body('relaxation', 'Required and must be numeric').trim().isNumeric(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } next();
    }
]


module.exports = middleware;