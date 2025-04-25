import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import  "dotenv/config";


const router = express.Router();


const generateToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
}



router.post("/register", async (req,res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if(username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    const exstingEmail = await User.findOne({ email });
    if (exstingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const exstingUsername = await User.findOne({ username });
    if (exstingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      profileImage:
        "https://www.gravatar.com/avatar/?d=mp&f=y",
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });

    const token = generateToken(user._id);


    res.status(201).json({
      token,
      user:{
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const{ email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {

    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
});

export default router;
