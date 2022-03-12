const { Users } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const users = await Users.find();

  res.send(users);
});

module.exports = router;
