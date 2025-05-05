require('dotenv').config;
const jwt = require('jsonwebtoken');
const User = require('../model/user')

async function userAuth(req, res, next) {
    try {
        const {accessToken} = req.cookies;
        if(!accessToken) {
            throw new Error('Invalid token');
        }

        const decodedObj = await jwt.verify(accessToken, process.env.JWT_SECRET);
        const user  = await User.findOne({_id:decodedObj._id});
        req.user = user;
        next();
    } catch (error) {
        res.send('Authentication failed: '+ error.message)
    }
}

module.exports = {
    userAuth
}