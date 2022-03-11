const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Api!");
});

app.listen(3000, () => {
  console.log(`Server is running http://localhost:3000`);
});
