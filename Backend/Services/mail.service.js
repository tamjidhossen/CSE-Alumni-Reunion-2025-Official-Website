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
          <p>If you have any questions, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
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
        console.log('Email sent:', info.response);
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
              <li><strong>Transaction ID:</strong> ${paymentData.paymentInfo.transactionId}</li>
              <li><strong>Date:</strong> ${paymentData.updatedAt}</li>
            </ul>
            <p>If you have any questions about your payment, feel free to contact us.</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
            <p>If you need assistance, contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
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
        console.log('Payment confirmation email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
        throw error;
    }
};

module.exports = { sendRegistrationMail, sendPaymentConfirmationMail };
