const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);

  // const product = {
  //   id: 1,
  //   name: "Hair Dresser",
  //   image: "some_url",
  // };
  // res.send(product);
});

router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((error) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });

  // const newProduct = req.body;
  // console.log(newProduct);
  // res.send(newProduct);
});

module.exports = router;
