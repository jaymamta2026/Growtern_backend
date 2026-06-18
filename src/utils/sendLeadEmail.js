import nodemailer from "nodemailer";
import path from "path";
import { getEmailContent } from "./emailTemplates.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendLeadEmail = async ({
  email,
  fullName,
  course,
  emailType,
}) => {
  try {
    const transporter = createTransporter();

    const template = getEmailContent({
      emailType,
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        
        <h2 style="color:#0d6efd;">
          Hello ${fullName},
        </h2>

        <h3>${template.title}</h3>

        <p>
          ${template.content}
        </p>

        ${
          course
            ? `
          <p>
            <strong>Selected Course:</strong> ${course}
          </p>
        `
            : ""
        }

        <p>
            You can download our company profile using the link below:
        </p>

        <p>
            <a href="https://drive.google.com/file/d/12wF7KrvAa3RIH9Oy8hNDeluxhk-02uuT/view?usp=drive_link">
            Download Growtern Company Profile
            </a>
        </p>
        <hr />

        <p>
          Regards,<br />
          <strong>Growtern Academy</strong>
        </p>

      </div>
    `;

    await transporter.sendMail({
      from: `"Growtern Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.title,
      html,

    //   attachments: [
    //     {
    //       filename: "Growtern_Company_Profile.pdf",
    //       path: path.join(
    //         process.cwd(),   //give current working directory path i.e - D:\work\growtern Technologies\working_directory_backend\Growtern_backend cuz index.js is in this directory.
    //         "assets",
    //         "Growtern_Company_Profile.pdf"
    //       ),
    //     },
    //   ],
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Lead email error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};