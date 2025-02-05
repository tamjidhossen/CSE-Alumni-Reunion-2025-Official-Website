const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
const sendRegistrationMail = async (to, subject, userData) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
          <h1>Thank You for Registering!</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Dear ${userData.personalInfo.name},</h2>
          <p>We are excited to welcome you as part of our alumni network. Your registration was successful!</p>
          <p><strong>Registration Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${userData.personalInfo.name}</li>
            <li><strong>Email:</strong> ${userData.contactInfo.email}</li>
            <li><strong>Session :</strong> ${userData.personalInfo.session}</li>
          </ul>
          <p>We look forward to staying connected and sharing updates with you.</p>
        </div>
        <div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
          <p>If you have any questions, feel free to contact us at <a href="mailto:alumnijkkniucse@gmail.com">alumnijkkniucse@gmail.com</a>.</p>
          <p>Best regards,</p>
          <p><strong>Your Alumni Team</strong></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"CSE ALUMNI COMMUNITY OF JKKNIU" <${process.env.EMAIL_USERNAME}>`, // Sender's email address
      to, // Recipient's email address
      subject, // Subject line
      text: `Thank you for registering, ${userData.name}!`, // Fallback plain text body
      html: htmlContent, // HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
const sendStudentConfirmationMail = async (to, subject, userData) => {
  try {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #0047AB; color: white; padding: 20px; text-align: center;">
        <h1>Welcome to the CSE Alumni Program!</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Dear ${userData.personalInfo.name},</h2>
        <p>We are thrilled to confirm your registration for the CSE Alumni Program at Jatiya Kabi Kazi Nazrul Islam University.</p>
        
        <p><strong>Your Registration Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${userData.personalInfo.name}</li>
          <li><strong>Email:</strong> ${userData.contactInfo.email}</li>
          <li><strong>Session:</strong> ${userData.personalInfo.session}</li>
        </ul>

        <p>Through this program, you will get exclusive updates on alumni events, networking opportunities, and career resources. Stay connected with us as we build a strong alumni community.</p>

        <p>We look forward to staying in touch and celebrating your journey with JKKNIU's CSE alumni network.</p>
      </div>
      <div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
        <p>If you have any questions, feel free to reach out at <a href="mailto:alumnijkkniucse@gmail.com">alumnijkkniucse@gmail.com</a>.</p>
        <p>Best regards,</p>
        <p><strong>CSE Alumni Community Team</strong></p>
      </div>
    </div>
  `;

    const mailOptions = {
      from: `"CSE ALUMNI COMMUNITY OF JKKNIU" <${process.env.EMAIL_USERNAME}>`, // Sender's email
      to, // Recipient's email
      subject, // Email subject
      text: `Dear ${userData.personalInfo.name}, your registration for the CSE Alumni Program is confirmed! Stay tuned for updates.`, // Plain text fallback
      html: htmlContent, // HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendPaymentRejectionMail = async (to, subject, userData) => {
  try {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #D32F2F; color: white; padding: 20px; text-align: center;">
        <h1>Payment Rejected</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Dear ${userData.personalInfo.name},</h2>
        <p>We regret to inform you that your payment for the CSE Alumni Program has been **rejected due to unavoidable reasons**.</p>
        
        <p><strong>Payment Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${userData.personalInfo.name}</li>
          <li><strong>Email:</strong> ${userData.contactInfo.email}</li>
          <li><strong>Session:</strong> ${userData.personalInfo.session}</li>
          <li><strong>Transaction ID:</strong> ${userData.paymentInfo.transactionId || 'N/A'}</li>
        </ul>

        <p>To resolve this issue or to get more details regarding the rejection, please contact our support team.</p>
        
        <p><strong>Contact Details:</strong></p>
        <ul>
          <li><strong>Phone:</strong> +8801732155234</li>
          <li><strong>Email:</strong> <a href="mailto:alumnijkkniucse@gmail.com">alumnijkkniucse@gmail.com</a></li>
        </ul>

        <p>We apologize for any inconvenience and appreciate your understanding.</p>
      </div>
      <div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
        <p>For further assistance, please do not hesitate to reach out.</p>
        <p>Best regards,</p>
        <p><strong>CSE Alumni Community Team</strong></p>
      </div>
    </div>
  `;

    const mailOptions = {
      from: `"CSE ALUMNI COMMUNITY OF JKKNIU" <${process.env.EMAIL_USERNAME}>`, // Sender's email
      to, // Recipient's email
      subject, // Email subject
      text: `Dear ${userData.personalInfo.name}, your payment has been rejected due to unavoidable reasons. Please contact us at +8801XXXXXXXXX for more details.`, // Plain text fallback
      html: htmlContent, // HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendPaymentConfirmationMail = async (to, subject, paymentData) => {
  try {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center;">
            <h1>Payment Confirmation</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Dear ${paymentData.personalInfo.name},</h2>
            <p>We have successfully received your payment. Thank you for your support!</p>
            <p><strong>Payment Details:</strong></p>
            <ul>
              <li><strong>Name:</strong> ${paymentData.personalInfo.name}</li>
              <li><strong>Email:</strong> ${paymentData.contactInfo.email}</li>
              <li><strong>Amount:</strong> ৳ ${paymentData.paymentInfo.totalAmount} BDT</li>
              <li><strong>Bank Account / Ref :</strong> ${paymentData.paymentInfo.transactionId}</li>
              <li><strong>Date:</strong> ${paymentData.updatedAt}</li>
            </ul>
            <p>If you have any questions about your payment, feel free to contact us.</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
            <p>If you need assistance, contact us at <a href="alumnijkkniucse@gmail.com">alumnijkkniucse@gmail.com</a>.</p>
            <p>Best regards,</p>
            <p><strong>Your Alumni Team</strong></p>
          </div>
        </div>
      `;

    const mailOptions = {
      from: `"CSE ALUMNI COMMUNITY OF JKKNIU" <${process.env.EMAIL_USERNAME}>`, // Sender's email address
      to, // Recipient's email address
      subject, // Subject line
      text: `Dear ${paymentData.personalInfo.name}, your payment of $${paymentData.paymentInfo.totalAmount} has been confirmed.`, // Fallback plain text body
      html: htmlContent, // HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
};

module.exports = { sendRegistrationMail, sendPaymentConfirmationMail, sendStudentConfirmationMail, sendPaymentRejectionMail };
