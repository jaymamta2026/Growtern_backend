import bcrypt from "bcryptjs";
import AdminModel from "../models/admin.model.js";
import generateToken from "../utils/jwt.js";

/* Register Admin */
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingAdmin = await AdminModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      data: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Login Admin */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminModel.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout Admin
export const logoutAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

// Get Current Admin
export const getCurrentAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.admin,
  });
};