const { Product } = require("../models/product");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
// const asyncErrorHandler = require("async-error-handler");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    // const fileName = file.originalname.replace(" ", "-");
    // file.mimetype;
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  // localhost:3000/api/v1/products?categories=2342342,234234
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  //// Learning on -exclude and show only specifice fields like: name image
  // const productList = await Product.find().select("name image -_id");
  const productList = await Product.find(filter).populate("category");

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
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

// router.post(`/`, async (req, res) => {
//   const category = await Category.findById(req.body.category);
//   if (!category) return res.status(400).send("Invalid Category");

//   let product = new Product({
//     name: req.body.name,
//     description: req.body.description,
//     richDescription: req.body.richDescription,
//     image: req.body.image,
//     brand: req.body.brand,
//     price: req.body.price,
//     category: req.body.category,
//     countInStock: req.body.countInStock,
//     rating: req.body.rating,
//     numReviews: req.body.numReviews,
//     isFeatured: req.body.isFeatured,
//   });

//   product = await product.save();

//   if (!product) return res.status(500).send("The product cannot be created");

//   res.send(product);
// });
//// =====================================================================
//// Upload Image Single
//// ================================================================
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    // image: req.body.image,
    //image: fileName, ////"http://localhost:3000/public/upload/image-23232.jpeg",
    image: `${basePath}${fileName}`,
    description: req.body.description,
    richDescription: req.body.richDescription,
    // image: req.body.image, <--- Error jud kay na double...
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
//// =====================================================================

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product Id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product) {
    res.status(400).send("The Product cannot be created");
  }
  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const productCount = await Product.countDocuments({ count: count });

  // const productCount = await Product.countDocuments((count) => count);
  // const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

// router.get(
//   `/get/count`,
//   asyncErrorHandler(async (req, res) => {
//     const productCount = await Product.countDocuments((count) => count);

//     if (!productCount) {
//       res.status(500).json({ success: false });
//     }
//     res.send({
//       productCount: productCount,
//     });
//   })
// );

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);
  // const products = await Product.find({ isFeatured: true });

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

// Url: api/v1/products/gallery-images/:id
// method PUT
// Access Private
router.put(
  `/gallery-images/:id`,
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("Invalid Product Id");
    }

    const files = req.files;
    let imagesPaths = [];

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        // imagesPaths.push(file.fileName);
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) {
      res.status(400).send("The Product cannot be created");
    }
    res.send(product);
  }
);

module.exports = router;
