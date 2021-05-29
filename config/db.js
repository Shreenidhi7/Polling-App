const mongoose = require("mongoose");
const keys = require("./keys");

// Map global Promise
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
