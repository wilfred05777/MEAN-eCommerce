const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  //// Learning on -exclude and show only specifice fields like: name image
  const productList = await Product.find().select("name image -_id");

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

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid Category");

  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
  // product
  //   .save()
  //   .then((createdProduct) => {
  //     res.status(201).json(createdProduct);
  //   })
  //   .catch((error) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });
  // const newProduct = req.body;
  // console.log(newProduct);
  // res.send(newProduct);
});

module.exports = router;
