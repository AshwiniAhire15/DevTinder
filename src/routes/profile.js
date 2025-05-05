const express = require('express');
const { userAuth } = require('../middleware/auth');
const User = require('../model/user');

const profileRouter = express.Router();

profileRouter.get('/profile/view',userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne({_id: userId });
        if(!user) {
            throw new Error('User does not exist');
        }
        return res.send(user);
    } catch (error) {
        res.send("Failed to get the user profile: "+ error.message);
    }
});

profileRouter.patch("/profile/:userId/edit", userAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const ALLOWED_FEILDS = ['age', "skills", "gender", "mobileNo"]
        
        const isAllowedKeys = Object.keys(req.body).every(key => ALLOWED_FEILDS.includes(key));
        if(!isAllowedKeys) {
            throw new Error("Some data is not allowed to update");
        }
        const user = await User.findByIdAndUpdate(userId, req.body);
        if(!user) {
            throw new Error("Failed to update the user");
        }
        return res.send("user details updated successfully!!")
    } catch (error) {
        console.log(error)
        res.status(400).send("Failed to update the user" + error);
    }
});

profileRouter.delete("/profile/user", userAuth, async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId)
        if(!user) {
            throw new Error("Failed to delete the users profile");
        }
        return res.send(user);
    } catch (error) {
        console.log(error)
        res.status(400).send("Failed to delete the users profile");
    }
})


module.exports = profileRouter;