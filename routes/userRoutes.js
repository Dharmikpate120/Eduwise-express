const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateString,
} = require("../utils/validators/validators");
const authModel = require("../utils/schema/Authentication");
const TestResultSchema = require("../utils/schema/TestResults");
require("dotenv").config();

router.post("/signin", async (req, res) => {
  const body = await req.body;
  var email = body.email;
  if (!email) {
    return res.status(404).json({ error: "email id is required" });
  }
  var password = body.password;
  if (!password) {
    return res.status(404).json({ error: "password is required" });
  }
  if (!validateEmail(email)) {
    return res.status(422).json({ error: "invalid email" });
  }

  const userCheck = await authModel.findOne({ email });
  if (!userCheck) {
    return res
      .status(404)
      .json({ error: "user not found in the records! please signup:)" });
  }
  try {
    const passwordMatch = bcrypt.compareSync(password, userCheck.password);
    if (passwordMatch) {
      const payload = { email, role: "user" };
      const secretKey = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(payload, secretKey, { expiresIn: "10d" });
      return res.status(200).json({
        success: "password matched",
        auth_token: token,
      });
    } else {
      return res.status(401).json({ error: "password is incorrect" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "password doesn't match!" });
  }
});
router.post("/signup", async (req, res) => {
  try {
    try {
      var body = await req.body;
    } catch (error) {
      console.log(error.message);
      body = null;
    }
    if (!body) {
      return res.status(404).json({ error: "all fields are required!" });
    }
    var email = body.email;
    var password = body.password;
    var name = body.name;
    if (!email || !password || !name) {
      return res.status(404).json({ error: "all fields are required!" });
    }
    if (!validateEmail(email)) {
      return res.status(422).json({ error: "invalid email" });
    } else if (!validateString(name)) {
      return res.status(422).json({ error: "invalid name" });
    }
    const userCheck = await authModel.findOne({ email });
    if (userCheck?.email) {
      return res.status(409).json({ error: "User Already Exists!" });
    } else {
      try {
        password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newUser = new authModel({
          email,
          password,
          name,
          role: "user",
        });

        await newUser.save();
        const testResult = new TestResultSchema({
          email,
          tests: [],
        });
        await testResult.save();
        const payload = { email, role: "user" };
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(payload, secretKey, { expiresIn: "10d" });

        return res.json({
          success: "account created successfully!",
          auth_token: token,
        });
      } catch (error) {
        console.log(error);
        return res
          .status(404)
          .json({ error: "An unknown error occured, Please try again later!" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      error: "An unknown error occured, Please try again later!",
    });
  }
});
module.exports = router;
