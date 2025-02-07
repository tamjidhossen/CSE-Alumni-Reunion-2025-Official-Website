const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
  },
});

/**
 * Send an email using Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject of the email
 * @param {Object} userData - Data of the registered alumni (name, registration info, etc.)
 * @returns {Promise} - Resolves when the email is sent successfully
 */
const createResponsiveEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: auto !important;
      }
      .content-padding {
        padding: 15px !important;
      }
      .table-responsive {
        overflow-x: auto !important;
      }
      .mobile-text {
        font-size: 14px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <div class="email-container" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    ${content}
  </div>
</body>
</html>
`;

const sendStudentConfirmationMail = async (to, subject, userData) => {
  try {
    const emailContent = `
      <div style="background-color: #1565C0; color: white; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;" class="mobile-text">Registration Confirmation</h1>
      </div>
      <div class="content-padding" style="padding: 30px; color: #333;">
        <p style="font-size: 16px; line-height: 1.5;" class="mobile-text">Dear ${userData.personalInfo.name},</p>
        <p style="font-size: 16px; line-height: 1.5;" class="mobile-text">We hope this email finds you well. We are pleased to confirm your registration for the CSE Alumni Reunion 2025.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #1565C0; margin-top: 0;" class="mobile-text">Registration Details</h3>
          <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Full Name:</strong></td>
                <td>${userData.personalInfo.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email Address:</strong></td>
                <td style="word-break: break-all;">${userData.contactInfo.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Academic Session:</strong></td>
                <td>${userData.personalInfo.session}</td>
              </tr>
            </table>
          </div>
        </div>

        <p style="font-size: 16px; line-height: 1.5;" class="mobile-text">We encourage you to stay actively involved with our alumni community and participate in upcoming events.</p>
      </div>
      <div style="background-color: #f1f1f1; padding: 25px; text-align: center;">
        <p style="margin: 0 0 15px 0;" class="mobile-text">For any inquiries, please contact us at:<br/>
        <a href="mailto:alumnijkkniucse@gmail.com" style="color: #1565C0; text-decoration: none;">alumnijkkniucse@gmail.com</a></p>
        <p style="margin: 0;" class="mobile-text">Best regards,<br/>
        <strong>CSE Alumni Community</strong><br/>
        <span style="font-size: 14px;">Jatiya Kabi Kazi Nazrul Islam University</span></p>
      </div>
    `;

    const htmlContent = createResponsiveEmailTemplate(emailContent);

    // Rest of the code remains the same
    const mailOptions = {
      from: `"CSE Alumni Community - JKKNIU" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      text: `Dear ${userData.personalInfo.name}, 
      Thank you for registering with the CSE Alumni Program at JKKNIU. Your registration has been confirmed with the following details:

      - Name: ${userData.personalInfo.name}
      - Email: ${userData.contactInfo.email}
      - Session: ${userData.personalInfo.session}

      Best regards,
      CSE Alumni Community
      Jatiya Kabi Kazi Nazrul Islam University`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendAlumniConfirmationMail = async (to, subject, paymentData) => {
  try {
    const emailContent = `
      <div style="background-color: #1565C0; color: white; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;" class="mobile-text">Registration Confirmation</h1>
      </div>
      <div class="content-padding" style="padding: 30px; color: #333;">
        <p style="font-size: 16px; line-height: 1.5;" class="mobile-text">Dear ${paymentData.personalInfo.name},</p>
        <p style="font-size: 16px; line-height: 1.5;" class="mobile-text">We are pleased to confirm that we have successfully received your payment for the CSE Alumni Reunion 2025.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #1565C0; margin-top: 0;" class="mobile-text">Transaction Details</h3>
          <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Name:</strong></td>
                <td>${paymentData.personalInfo.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td style="word-break: break-all;">${paymentData.contactInfo.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount Paid:</strong></td>
                <td>৳ ${paymentData.paymentInfo.totalAmount} BDT</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Account No./ Reference:</strong></td>
                <td style="word-break: break-all;">${paymentData.paymentInfo.transactionId}</td>
              </tr>
            </table>
          </div>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;" class="mobile-text">We look forward to your presence at the reunion. Further details will be communicated soon.</p>
      </div>
      <div style="background-color: #f1f1f1; padding: 25px; text-align: center;">
        <p style="margin: 0 0 15px 0;" class="mobile-text">For any queries, please contact us at:<br/>
        <a href="mailto:alumnijkkniucse@gmail.com" style="color: #1565C0; text-decoration: none;">alumnijkkniucse@gmail.com</a></p>
        <p style="margin: 0;" class="mobile-text">Best regards,<br/>
        <strong>CSE Alumni Community</strong><br/>
        <span style="font-size: 14px;">Jatiya Kabi Kazi Nazrul Islam University</span></p>
      </div>
    `;

    const htmlContent = createResponsiveEmailTemplate(emailContent);

    // Rest of the code remains the same
    const mailOptions = {
      from: `"CSE Alumni Community - JKKNIU" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      text: `Dear ${paymentData.personalInfo.name}, thank you for your payment of ৳${paymentData.paymentInfo.totalAmount} BDT. Your registration for the CSE Alumni Reunion 2025 is now complete.`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    throw error;
  }
};

module.exports = {
  sendStudentConfirmationMail,
  sendAlumniConfirmationMail
};