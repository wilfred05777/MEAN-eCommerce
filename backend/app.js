const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config"); // dapat taas sy sa const api = process.env.API_URL; mag cause ug error
const api = process.env.API_URL;
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/user");

//// Middleware
app.use(express.json());
app.use(morgan("tiny"));

const Product = require("./models/product");

//// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log(`Server is running http://localhost:3000`);
});
