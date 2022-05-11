require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/", require("./routes/root"));
app.use('/states', require('./routes/states'))

//Non-existing paths
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ error: "404 not found" });
    } else {
      res.type("txt").send("404 not found");
    }
  });

mongoose.connection.once("open", () => {
    console.log("connected to the database");
    app.listen(port, () => console.log(`app listening on port ${port}`));
});