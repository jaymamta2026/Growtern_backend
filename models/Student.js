import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  whatsappNumber: { type: String },
  qualification: { type: String, required: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Student", studentSchema);
