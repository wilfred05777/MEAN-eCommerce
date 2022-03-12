const mongoose = require("mongoose");

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
  },
  image: {
    type: String,
  },
});

exports.Categories = mongoose.model("Categories", catergoriesSchema);
