// ============= util/sendEmail.js =============

import nodemailer from "nodemailer";

/* =========================================================
   CREATE TRANSPORTER
   - Explicitly set host + port instead of service:"gmail"
   - This is more reliable on cloud servers like Render
   ========================================================= */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is missing from environment variables. " +
        "Add them in Render → Environment.",
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com", // explicit host (more reliable than service:"gmail")
    port: 465, // 465 = SSL (more stable on cloud), 587 = TLS
    secure: true, // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // must be Gmail App Password (not your login password)
    },
    // Increase timeouts for cloud servers (Render can be slow on cold start)
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

/* =========================================================
   EMAIL TEMPLATE
   ========================================================= */
const buildHtmlTemplate = (student) => {
  const LOGO_URL = "https://www.growtern.com/assets/Inte_logo-CRYEwrjA.png";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: Arial, Helvetica, sans-serif;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600"
              style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <img src="${LOGO_URL}" alt="Growtern Academy"
                    style="max-width: 180px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
                  <h1 style="margin: 0; color: orange; font-size: 28px; font-weight: 600;">
                    ✓ Payment Successful
                  </h1>
                  <p style="margin: 10px 0 0 0; color: orange; font-size: 14px;">
                    Thank you for choosing us!
                  </p>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Dear <strong>${student.fullName}</strong>,
                  </p>
                  <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.6;">
                    Thank you for your payment! We're excited to have you join Growtern Academy.
                    Your payment has been successfully processed and confirmed.
                  </p>
                </td>
              </tr>

              <!-- Amount -->
              <tr>
                <td style="padding: 0 40px;">
                  <table cellpadding="20" cellspacing="0" border="0" width="100%"
                    style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px;">
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                          Amount Paid
                        </p>
                        <h2 style="margin: 0; color: #667eea; font-size: 36px; font-weight: 700;">
                          ₹${student.amount}
                        </h2>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Student Info -->
              <tr>
                <td style="padding: 30px 40px 20px 40px;">
                  <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px; font-weight: 600;
                    border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                    📋 Student Information
                  </h3>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    ${[
                      ["Name", student.fullName],
                      ["Email", student.email],
                      ["Contact", student.contactNumber],
                      ["WhatsApp", student.whatsappNumber],
                      ["Qualification", student.qualification],
                      ["Course Enrolled", student.interestedCourse],
                      ["Payment Type", student.paymentType],
                    ]
                      .map(
                        ([label, value]) => `
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #666666; font-size: 14px;">${label}:</td>
                        <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #333333; font-size: 14px;">${value || "—"}</strong>
                        </td>
                      </tr>`,
                      )
                      .join("")}
                  </table>
                </td>
              </tr>

              <!-- Transaction Details -->
              <tr>
                <td style="padding: 20px 40px;">
                  <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px; font-weight: 600;
                    border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                    💳 Transaction Details
                  </h3>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #666666; font-size: 14px;">Payment ID:</td>
                      <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                        <strong style="color: #333333; font-size: 13px; font-family: monospace;">${student.razorpay_payment_id}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #666666; font-size: 14px;">Order ID:</td>
                      <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                        <strong style="color: #333333; font-size: 13px; font-family: monospace;">${student.razorpay_order_id}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #666666; font-size: 14px;">Status:</td>
                      <td align="right" style="padding: 10px 0;">
                        <span style="background-color: #10b981; color: #ffffff; padding: 4px 12px;
                          border-radius: 20px; font-size: 12px; font-weight: 600;">
                          ✓ SUCCESS
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Next Steps -->
              <tr>
                <td style="padding: 10px 40px 30px 40px;">
                  <table cellpadding="20" cellspacing="0" border="0" width="100%"
                    style="background-color: #f9fafb; border-radius: 8px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 15px; font-weight: 600;">
                          📚 What's Next?
                        </p>
                        <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          Our team will contact you shortly with course details and joining instructions.
                          Keep this email for your records.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <img src="${LOGO_URL}" alt="Growtern Academy"
                    style="max-width: 150px; height: auto; margin-bottom: 15px;" />
                  <p style="margin: 0 0 5px 0; color: #333333; font-size: 15px; font-weight: 600;">Best Regards,</p>
                  <p style="margin: 0 0 5px 0; color: #667eea; font-size: 16px; font-weight: 700;">Growtern Academy</p>
                  <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px;">Bhubaneswar, Odisha</p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    This is an automated email. Please do not reply to this message.<br/>
                    For queries, contact us at ${process.env.EMAIL_USER}
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/* =========================================================
   SEND PAYMENT EMAIL
   - Does NOT throw — logs error and returns { success: false }
   - Controller handles non-blocking call via .catch()
   ========================================================= */
export const sendPaymentEmail = async (student) => {
  try {
    const transporter = createTransporter();

    // Verify SMTP connection before sending (helps catch credential issues early)
    await transporter.verify();

    await transporter.sendMail({
      from: `"Growtern Academy" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: "✓ Payment Successful - Growtern Academy",
      html: buildHtmlTemplate(student),
    });

    console.log("Payment email sent successfully to:", student.email);
    return { success: true };
  } catch (error) {
    // Log the real error but DO NOT throw
    // Controller uses .catch() so this won't affect the payment response
    console.error("Email sending failed:", {
      message: error.message,
      code: error.code, // e.g. ECONNREFUSED, EAUTH
      command: error.command, // e.g. AUTH, EHLO
    });
    return { success: false, error: error.message };
  }
};
