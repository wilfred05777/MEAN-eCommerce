const mongoose = require("mongoose");

const orderItemsSchema = mongoose.Schema({
  product: String,
  quantity: Number,
});

exports.OrderItems = mongoose.model("OrderItems", orderItemsSchema);
