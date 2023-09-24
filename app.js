const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");



dotenv.config({ path: "./config.env" });
require("./db/conn");


// app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const User = require("./models/userSchema");
app.use(require("./router/auth"));
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production" ) {
  
  // Add a catch-all route for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "invoicerfrontend", "build", "index.html"));
  });
}




app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
