const express = require("express");
const router = express.Router();
const { Orders } = require("../models/order");

router.get(`/`, async (req, res) => {
  const orders = await Orders.find();

  if (!orders) {
    res.status(500).json({ success: false });
  }

  res.send(orders);
});

module.exports = router;
