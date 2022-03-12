const mongoose = require("mongoose");

//// Example of Product schema
const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    require: true,
    type: Number,
  },
});

//// Example of Product Model
exports.Product = mongoose.model("Product", productSchema);
