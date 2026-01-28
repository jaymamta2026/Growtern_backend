import bcrypt from "bcryptjs";
import genToken from "../util/token.js";
import jwt from "jsonwebtoken";
import AdminModel from "../models/admin.model.js";

// Register
export const RegisterUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    let user = await AdminModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User Already Exist",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password Must be at least 6 character",
      });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await AdminModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    // set token in Cookie
    res.cookie("userToken", token, {
      sucure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      message: "Register SuccessFully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
    });
  }
};

// Login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "InCorrect Username or Password",
      });
    }
    const token = await genToken(user._id);
    // set token in Cookie
    res.cookie("userToken", token, {
      sucure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Login Successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login error" || error,
    });
  }
};

// LogOut
export const LogOut = async (req, res) => {
  try {
    res.clearCookie("userToken");
    return res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "LogOut Error",
    });
  }
};

// CheckAuth
export const CheckAuth = async (req, res) => {
  try {
    const token = req.cookies.userToken;
    if (!token) {
      return res.status(401).json({ message: "Not Authencated" });
    }
    jwt.verify(token, process.env.JWT_SECRETE);
    res.status(200).json({ message: "Authencate" });
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
