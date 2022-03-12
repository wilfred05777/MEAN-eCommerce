const { Users } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const users = await Users.find();

  res.send(users);
});

router.post(`/`, async (req, res) => {
  const user = new Users({
    name: req.body.name,
  });
  user
    .save()
    .then((createUser) => {
      res.status(201).json(createUser);
    })
    .catch((error) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;
