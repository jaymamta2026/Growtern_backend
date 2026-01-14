import Student from '../models/Student.js';

export const saveStudent = async (req, res) => {
  try {
    const { fullName, email, contactNumber, whatsappNumber, qualification, course } = req.body;

    // Save to DB
    const student = new Student({ fullName, email, contactNumber, whatsappNumber, qualification, course });
    await student.save();

    res.status(200).json({ message: 'Form submitted successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
