const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fromUserId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        },
        required: true
    }
}, {
    timestamps: true
});

connectionRequestSchema.pre("save", function (next) {
    const connectionReq = this;
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)) {
        throw new Error("You can't send request to yourself!");
    }
    next();
})

const ConnectionReqModel = mongoose.model("ConnectionReqModel", connectionRequestSchema);

module.exports = ConnectionReqModel;