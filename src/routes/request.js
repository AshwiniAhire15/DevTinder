const express = require('express');
const {isValidConnectionStatus} = require('../utils/utils');
const User = require('../model/user');
const ConnectionReqModel = require('../model/connectionRequest');
const {userAuth} = require('../middleware/auth')

const requestRouter = express.Router();


requestRouter.post("/connectionRequest/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUser = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        console.log(fromUser);
        console.log(toUserId);
        console.log(status);
        // if the given status is valid or not
        if(!isValidConnectionStatus(status)) {
            throw new Error("Invalid connection request status");
        }
        //if the given user already exist in our system or not
        const toUser = await User.findOne({_id: toUserId});
        if(!toUser) {
            throw new Error("User with given Id does not exist");
        }

        // check if the there is already any existing connection request present or not;
        const existingConnectionReq = await ConnectionReqModel.findOne({
            $or: [
                {
                    toUserId: toUserId,
                    fromUserId: fromUser._id,

                },
                {
                    toUserId: fromUser._id,
                    fromUserId: toUserId
                }
            ]
        });
        if(existingConnectionReq) {
            throw new Error("Can't send the connection request as its has already been sent.");
        }
        const connectionReq = new ConnectionReqModel({
            fromUserId: fromUser._id,
            toUserId: toUserId,
            status: status
        });

        await connectionReq.save();
        res.send('Connection request sent successfully to ' +toUser.firstName);

    } catch (error) {
        res.status(400).send('Failed to send the connection request to ' + req.user.firstName + error);
    }
})

requestRouter.post('/connectionRequest/review/:status/:requestId', userAuth, async (req, res) => {
    const {status, requestId} = req.params;
    try {
        const loggedInUser = req.user;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: `Invalid status`});
        }

        const connectionReq = await ConnectionReqModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested',
        });
        if(!connectionReq) {
            return res.status(400).json({message: "Connection request does on exist"});
        }

        connectionReq.status = status;
        const data = await connectionReq.save();
        return res.json({message: `Connection ${status} successfully!!`, data: data});

    } catch (error) {
        res.status(400).send(`Failed to {status} request ${error}`);
    }

})
module.exports = requestRouter;