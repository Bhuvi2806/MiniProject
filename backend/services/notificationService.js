const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
// In production, use real SMTP credentials from process.env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'ethereal_password'
  }
});

/**
 * Sends an emergency broadcast alert to a donor.
 * As per AGENT.md, this mocks the "mass rapid-alert via SMS" by using email for the MVP.
 */
const sendEmergencyAlert = async (donorEmail, hospitalName, bloodGroup, unitsNeeded) => {
  const mailOptions = {
    from: '"BloodLink Emergency Dispatch" <dispatch@blooddonorfinder.local>',
    to: donorEmail,
    subject: `🚨 URGENT: ${bloodGroup} Blood Needed at ${hospitalName}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 2px solid #DC2626; border-radius: 8px;">
        <h2 style="color: #DC2626;">EMERGENCY BLOOD REQUEST</h2>
        <p><strong>Blood Group Required:</strong> ${bloodGroup}</p>
        <p><strong>Location:</strong> ${hospitalName}</p>
        <p><strong>Units Needed:</strong> ${unitsNeeded}</p>
        <hr />
        <p>You have been identified as a verified donor in the immediate transit zone. Please respond immediately if you can donate.</p>
        <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #DC2626; color: white; text-decoration: none; border-radius: 4px;">Confirm Availability</a>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Alert sent to ${donorEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email alert:', error);
    throw error;
  }
};

module.exports = {
  sendEmergencyAlert
};
