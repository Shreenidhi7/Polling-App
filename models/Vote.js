const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  points: {
    type: String,
    required: true,
  },
});

// Create Collection and Add Schema
const vote = mongoose.model("Vote", VoteSchema);

module.exports = vote;
