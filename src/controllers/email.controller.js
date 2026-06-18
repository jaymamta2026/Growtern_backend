import { sendLeadEmail } from "../utils/sendLeadEmail.js";

export const sendLeadEmailController = async (req, res) => {
  try {
    const {
      email,
      fullName,
      course,
      emailType,
    } = req.body;

    console.log(req.body)

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await sendLeadEmail({
      email,
      fullName,
      course,
      emailType,
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("sendLeadEmailController:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};