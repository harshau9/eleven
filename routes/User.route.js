const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticate } = require("../middlewares/authenticate.middleware");

userRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).send({ mssg: "Email already registered" });
    } else {
      bcrypt.hash(req.body.password, 6, async (err, hash) => {
        if (err) return res.send(err);
        const user = await UserModel.create({ email, password: hash});
        res.status(201).send("Registered successfully");
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

userRouter.post("/login",async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: UserModel._id }, process.env.key);
          res.status(200).send({
            msg: "Login successfull",
            token: token,
          });
        } else {
          res.status(400).send("Wrong credentials");
        }
      });
    } else {
      return res.status(400).send("Email not found!");
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

userRouter.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await UserModel.find();
    res.status(200).send(user);
  } catch (e) {
    console.log(e);
  }
});

userRouter.put("/edit/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { image, name, bio, phone, email, password } = req.body;
  try {
    bcrypt.hash(password, 6, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const user = await UserModel.findByIdAndUpdate(id, {
          image,
          name,
          bio,
          phone,
          email,
          password: hash,
        });
        if (!user) {
          return res.status(400).json({ message: `User not found!` });
        }
        res.status(200).json({ message: "Updated User Details Successfully" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});


module.exports = {
  userRouter
}
