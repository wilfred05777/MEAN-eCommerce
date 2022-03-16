const { Users } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// @desc View all user
// @route GET /api/v1/users
// @access Public
router.get(`/`, async (req, res) => {
  // const userList = await Users.find();
  const userList = await Users.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// @desc View single user
// @route GET /api/v1/users
// @access ??
router.get(`/:id`, async (req, res) => {
  // const user = await Users.findById(req.params.id);
  const user = await Users.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res
      .status(500)
      .json({ message: "The User with the given ID was not found" });
  }
  res.status(200).send(user);
});

// @desc POST New User
// @route POST /api/v1/users
// @access Public
router.post(`/`, async (req, res) => {
  let user = new Users({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    // passwordHash: req.body.passwordHash,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  res.send(user);
  // user
  //   .save()
  //   .then((createUser) => {
  //     res.status(201).json(createUser);
  //   })
  //   .catch((error) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });
});

// @desc Update User
// @route PUT /api/v1/users/:id
// @access private
router.put("/:id", async (req, res) => {
  const userExist = await Users.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await Users.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      // passwordHash: req.body.passwordHash,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

module.exports = router;
