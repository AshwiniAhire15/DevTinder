require('dotenv').config();
const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user")

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

connectDb().then(() => {
    console.log("Database connection established successfully!!");
    app.listen(3000, () => {
        console.log("server started listening on port 3000");
    })
}).catch((error) => {
    console.log("failed to established the database connection: "+ error.message);
})
