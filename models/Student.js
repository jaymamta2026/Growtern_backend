import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    whatsappNumber: String,
    qualification: String,
    course: String,
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
