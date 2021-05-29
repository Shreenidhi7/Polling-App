const express = require("express");
const path = require("path"); // declaring public floder
const bodyParser = require("body-parser"); // getting data from our form
const cors = require("cors"); // required for cross domain functionlity

//Environment variables configuration
require("dotenv").config();

//Database configuration
require("./config/db");

const app = express();

const poll = require("./routes/poll");

//Seting up public folder
app.use(express.static(path.join(__dirname, "public")));

//Body-parser middleWare
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//Enabling CORS
app.use(cors());

app.use("/poll", poll);

//Creating the port number
const port = 3000;

//Starting the Server
app.listen(port, () => console.log(`Server started on port : ${port}`));
