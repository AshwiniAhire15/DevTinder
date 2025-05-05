const express = require('express');
const {userAuth} = require('../middleware/auth');
const ConnectionReqModel = require('../model/connectionRequest');
const User = require('../model/user');

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) =>{

    try {
        const user = req.user;

        const connectionReqs = await ConnectionReqModel.find({
            toUserId: user._id,
            status: "interested"
        }).populate("fromUserId", ['firstName', "lastName", "age", "gender", "skills"]);

        return res.json({messge: "Data fetched successfully!!", data: connectionReqs})
    } catch (error) {
        res.status(400).json({message: "Failed to fetched the received request "+ error.message});
    }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
    try {
        const user = req.user;

        const connections = await ConnectionReqModel.find({
            $or: [
                {fromUserId: user._id, status: "accepted"},
                {toUserId: user._id, status: "accepted"}

            ]
        }).populate("fromUserId", ['firstName', "lastName", "age", "gender", "skills"])
          .populate("toUserId", ['firstName', "lastName", "age", "gender", "skills"]);

        const data = connections.map(row  => {
            if(row.fromUserId._id.toString() === user._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        return res.json({data: data});
    } catch (error) {
        res.status(400).json({message: "Failed to fetched the accepted request "+ error.message});
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const loggedInUser = req.user;

        const connections = await ConnectionReqModel.find({
            $or: [
                {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideConnectionList = new Set();
        connections.forEach(con => {
            hideConnectionList.add(con.toUserId.toString());
            hideConnectionList.add(con.fromUserId.toString());
        });

        const usersFeedData = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideConnectionList)} },
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(['firstName', "lastName", "age", "gender", "skills"])
          .skip(skip).limit(limit);

        return res.json({data: usersFeedData});
    } catch (error) {
        return res.status(400).json({message: "Failed to get the feed for you "+ error.message});
    }
})
module.exports = userRouter