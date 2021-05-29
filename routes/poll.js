const express = require("express");
const router = express.Router();

const Vote = require("../models/Vote");

const Pusher = require("pusher");

const keys = require("../config/keys");

const pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  useTLS: keys.useTLS,
});

router.get("/", (req, res) => {
  Vote.find().then((votes) =>
    res.json({
      success: true,
      votes: votes,
    })
  );
});

router.post("/", (req, res) => {
  // pushing votes to db
  const newVote = {
    author: req.body.author,
    points: 1,
  };

  // bringing vote from model
  new Vote(newVote).save().then((vote) => {
    pusher.trigger("author-poll", "author-vote", {
      points: parseInt(vote.points),
      author: vote.author,
    });

    return res.json({
      success: true,
      message: "Thank you for voting",
    });
  });
});

module.exports = router;
