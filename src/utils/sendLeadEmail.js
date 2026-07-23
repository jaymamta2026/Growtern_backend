import { Resend } from "resend";
import { getEmailContent } from "./emailTemplates.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// While testing without a verified domain on resend.com/domains,
// you MUST use this exact address as the "from" sender.
// Once your domain (growtern.com) is verified, change this to:
// const FROM_ADDRESS = "Growtern Academy <noreply@growtern.com>";
const FROM_ADDRESS = "Growtern Academy <onboarding@resend.dev>";

export const sendLeadEmail = async ({
  email,
  fullName,
  phone,
  course,
  emailType,
}) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is missing from environment variables. " +
          "Add it in Render → Environment (and locally in your .env file)."
      );
    }

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

    // ---- Email to the student/lead ----
    const { error: studentError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: template.title,
      html,
    });

    if (studentError) {
      console.error("Lead email (student) error:", studentError);
      return {
        success: false,
        message: studentError.message || JSON.stringify(studentError),
      };
    }

    // ---- Notification email to Growtern Team ----
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

    // Notification goes to your own team inbox — set ADMIN_EMAIL in your env,
    // falling back to EMAIL_USER if you still have that variable set.
    const adminRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const { error: adminError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: adminRecipient,
      subject: adminSubject,
      html: adminHtml,
    });

    if (adminError) {
      // Student email already succeeded, so log this but don't fail the whole request
      console.error("Lead email (admin notification) error:", adminError);
    }

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