const { Users } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get(`/`, async (req, res) => {
  const userList = await Users.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get(`/:id`, async (req, res) => {
  const user = await Users.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res
      .status(500)
      .json({ message: "The User with the given ID was not found" });
  }
});

router.post(`/`, async (req, res) => {
  let user = new Users({
    name: req.body.name,
    email: req.body.email,
    // passwordHash: req.body.passwordHash,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
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

module.exports = router;
