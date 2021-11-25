const jwt = require('jsonwebtoken');
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

module.exports = middleware;