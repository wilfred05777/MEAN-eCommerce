const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc View all user
// @route GET /api/v1/users
// @access Public
router.get(`/`, async (req, res) => {
  // const userList = await User.find();
  const userList = await User.find().select("-passwordHash");
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
  const user = await User.findById(req.params.id).select("-passwordHash");

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
  let user = new User({
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
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
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

// @desc Login User
// @route POST /api/v1/users/login
// @access private
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }
  // return res.status(200).send(user);

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    ///// if authentication is working fine - jsonwebtoken - ability to
    const token = jwt.sign(
      {
        userId: user.id,

        isAdmin: user.isAdmin, //52. Users & Admins
      },
      secret,
      { expiresIn: "1d" }
    );

    //// res.status(200).send("user Authenticated");
    ///// jsonwebtoken
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});

// @desc REGISTER User
// @route POST /api/v1/users/register
// @access public
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
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

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

// @desc DELETE Single User by ID
// @route POST /api/v1/users/:id
// @access private
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// @desc DELETE Single User by ID
// @route POST /api/v1/users/get/count
// @access public - 53. Get User Count REST API
router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

module.exports = router;
