const express = require('express');
const { isValidateReqData } = require('../utils/utils');
const User = require('../model/user');
const authRouter = express.Router();
const bcrypt = require('bcrypt');

authRouter.post('/signUp', async (req, res) => {
    try {
        if(isValidateReqData(req.body)){
            const {firstName, lastName, emailId, password} = req.body;
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({firstName, lastName, emailId, password: hashPassword});
            await user.save();
            res.send("User saved successfully!!"); 
        }
         
    } catch (error) {
        res.status(400).send("failed to save the user"+ error.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error('User is not registered');
        }
        const isPasswordCorrect = await user.validatePassword(password);
        if(!isPasswordCorrect) {
            throw new Error('Invalid credentials');
        }

        const token = await user.getJWTToken();

        res.cookie("accessToken", token);
        res.send('Login successfully!!');
    } catch (error) {
        res.send("Login failed: "+ error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie('accessToken', null, {
        expires: new Date(Date.now())
    })
    res.send("Logout successfully!!");
})

module.exports = authRouter;