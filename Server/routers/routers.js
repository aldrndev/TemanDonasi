const express = require("express");
const routers = express();
const userRouter = require("./userRouter");
const adminRouter = require("./adminRouter");
routers.use("/pub", userRouter);
routers.use("/admin", adminRouter);
module.exports = routers;
