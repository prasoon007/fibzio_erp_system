const courseServices = require('../services/authService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const authCtrl = {}

authCtrl.apiAuthAdminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const foundUser = await authService.authAdminLogin(username);
        if (!foundUser) return res.status(400).send({ success: false, error: 'Invalid Credentials' });
        //* after finding user, we are verifying req.body.password(hash) from password hash from database
        let passCheck = await bcrypt.compare(password, foundUser.password);
        if (!passCheck) return res.status(400).json({ success: false, error: 'Invalid Password Credentials' });
        //setting up jwt using user id and authLev
        const data = {
            user: {
                id: foundUser.id,
                authLev: 0
            }
        }
        let authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ success: true, authToken });
    } catch (error) {
        res.status(500).json('Internal Server Error' + error.message);
    }
}


authCtrl.apiAuthSchoolLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const foundUser = await authService.authSchoolLogin(username, authLev);
        if (!foundUser) return res.status(400).send({ success: false, error: 'Invalid Credentials' });
        //* after finding user, we are verifying req.body.password(hash) from password hash from database
        let passCheck = await bcrypt.compare(password, foundUser.password);
        if (!passCheck) return res.status(400).json({ success: false, error: 'Invalid Password Credentials' });
        //setting up jwt using user id and authLev
        const data = {
            user: {
                id: foundUser.id,
                authLev: 1
            }
        }
        let authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ success: true, authToken });
    } catch (error) {
        res.status(500).json('Internal Server Error' + error.message);
    }
}


authCtrl.apiAuthStudentParentLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const foundUser = await authService.authStudentParentLogin(email);
        if (!foundUser) return res.status(400).send({ success: false, error: 'Invalid Credentials' });
        let passCheck = await bcrypt.compare(password, foundUser.password);
        if (!passCheck) return res.status(400).json({ success: false, error: 'Invalid Password Credentials' });
        const data = {
            user: {
                id: foundUser.id,
                authLev: 2
            }
        }
        let authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ success: true, authToken });
    } catch (error) {
        res.status(500).json('Internal Server Error' + error.message);
    }
}

module.exports = authCtrl;