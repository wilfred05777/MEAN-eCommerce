const mongoose = require("mongoose");

const categoriesSchema = mongoose.Schema({
  name: String,
  color: String,
  icon: String,
  image: String,
});

exports.Categories = mongoose.model("Categories", catergoriesSchema);
