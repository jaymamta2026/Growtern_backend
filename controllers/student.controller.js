import Student from "../models/Student.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Student Create Error:", error);
    res.status(500).json({ message: "Failed to save student details" });
  }
};
