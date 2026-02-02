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

    // ✅ FIXED: Remove await
    const token = genToken(user._id);

    // ✅ FIXED: secure (was sucure)
    res.cookie("userToken", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      message: "Register Successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
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
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    // ✅ FIXED: Remove await
    const token = genToken(user._id);

    res.cookie("userToken", token, {
      secure: false, // true in production (https)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const { password: _, ...safeUser } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      admin: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login error",
    });
  }
};

// LogOut
export const LogOut = async (req, res) => {
  try {
    res.clearCookie("userToken");
    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "LogOut Error",
    });
  }
};

// CheckAuth
export const CheckAuth = async (req, res) => {
  try {
    const token = req.cookies.userToken;
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not Authenticated" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await AdminModel.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Authenticated",
      admin: user
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: "Invalid Token" 
    });
  }
};