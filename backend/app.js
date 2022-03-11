const express = require("express");
const app = express();

require("dotenv/config");

const api = process.env.API_URL;

//// http://localhost:3000/api/v1/products
app.get(api + "/products", (req, res) => {
  res.send("Hello Api!");
});

app.listen(3000, () => {
  console.log(api);
  console.log(`Server is running http://localhost:3000`);
});
