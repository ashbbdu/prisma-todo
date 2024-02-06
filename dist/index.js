"use strict";
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const app = express();
app.use(express.json());
const PORT = 4000;
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/todo", todoRoutes);
app.get("/", (req, res) => {
    res.send("App is up and running");
});
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
