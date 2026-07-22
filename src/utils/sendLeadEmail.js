import path from "path";
import { transporter } from "./transporter.js";
import { getEmailContent } from "./emailTemplates.js";


export const sendLeadEmail = async ({
  email,
  fullName,
  phone,
  course,
  emailType,
}) => {
  try {

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

        ${course
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

    // email to std trnasporter
    await transporter.sendMail({
      from: `"Growtern Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.title,
      html,
    });

    // email to us Send notification email to Growtern Team

    let adminSubject = `🔥 New ${emailType} Submission - ${fullName}`;
    let adminHtml;
    if (emailType === "referral") {

      adminSubject = "📩 New Referral Form Submission";

      adminHtml = `
    <div style="font-family: Arial, sans-serif;">
      <h2 style="color:#F39001;">📩 New Referral Request</h2>

      <p>
        A new referral request has been submitted.
      </p>

      <p>
        <strong>Referrer Name:</strong> ${fullName}
      </p>

      <p>
        Please check the Google Sheet/Admin Panel for complete details.
      </p>
    </div>
  `;

    } else if (emailType === "hire-from-us") {

      adminSubject = "🏢 New Hire From Us Request";

      adminHtml = `
    <div style="font-family: Arial, sans-serif;">
      <h2 style="color:#F39001;">🏢 New Hire From Us Request</h2>

      <p>
        A company has submitted a hiring request.
      </p>

      <p>
        <strong>Contact Person Name:</strong> ${fullName}
      </p>

      <p>
        Please check the Google Sheet/Admin Panel for complete details.
      </p>
    </div>
  `;

    } else {

      adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">

      <h2 style="color:#F39001;">
        🚀 New Form Submission
      </h2>

      <table
        cellpadding="10"
        cellspacing="0"
        border="1"
        style="
          border-collapse:collapse;
          width:100%;
          font-size:15px;
        "
      >

        <tr>
          <td><strong>Student Name</strong></td>
          <td>${fullName}</td>
        </tr>

        <tr>
          <td><strong>Email</strong></td>
          <td>${email}</td>
        </tr>

        <tr>
          <td><strong>Phone</strong></td>
          <td>${phone || "N/A"}</td>
        </tr>

        <tr>
          <td><strong>Course</strong></td>
          <td>${course || "N/A"}</td>
        </tr>

        <tr>
          <td><strong>Form Name</strong></td>
          <td>${emailType}</td>
        </tr>

        <tr>
          <td><strong>Submitted At</strong></td>
          <td>${new Date().toLocaleString("en-IN")}</td>
        </tr>

      </table>

    </div>
  `;
    }

    await transporter.sendMail({
      from: `"Growtern Academy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: adminSubject,
      html: adminHtml,
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