const { OrderItems } = require("../models/orderItems");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderItem = await OrderItems.find();

  if (!orderItem) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(OrderItems);
});

module.exports = router;
