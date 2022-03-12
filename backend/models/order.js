const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  shippingAddress1: String,
  shippingAddress2: String,
  city: String,
  country: String,
  phone: Number,
});
// orderItems: orderItem[]

exports.Orders = mongoose.model("Orders", ordersSchema);
