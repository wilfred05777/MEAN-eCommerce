const express = require("express");
const router = express.Router();
const { Categories } = require("../models/category");

router(`/`, async (req, res) => {
  const category = await Categories.find();

  if (!category) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(category);
});

module.exports = router;
