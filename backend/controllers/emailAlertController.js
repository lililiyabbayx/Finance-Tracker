const nodemailer = require("nodemailer");
const EmailAlert = require("../model/emailAlert");

const createTransporter = () => {
  // Check if required environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add additional configuration for better reliability
    pool: true, // Use pooled connections
    maxConnections: 1, // Limit concurrent connections
    rateDelta: 20000, // Wait 20 seconds between emails
    rateLimit: 5, // Limit to 5 emails per rateDelta
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const createEmailContent = ({ subject, message, budget, spent }) => {
  const formattedBudget = formatCurrency(budget);
  const formattedSpent = formatCurrency(spent);
  const overspentAmount = formatCurrency(spent - budget);

  return {
    subject: subject || `Budget Alert: You've exceeded your monthly budget`,
    text: message || `
Hello,

This is an automated alert from your Finance Tracker.

Your monthly spending has exceeded your budget:
- Budget: ${formattedBudget}
- Spent: ${formattedSpent}
- Overspent by: ${overspentAmount}

Please review your expenses and adjust your spending accordingly.

Best regards,
Your Finance Tracker Team
    `.trim(),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Budget Alert</h2>
        <p>This is an automated alert from your Finance Tracker.</p>
        <p>Your monthly spending has exceeded your budget:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Budget:</strong> ${formattedBudget}</p>
          <p style="margin: 5px 0;"><strong>Spent:</strong> ${formattedSpent}</p>
          <p style="margin: 5px 0; color: #d32f2f;"><strong>Overspent by:</strong> ${overspentAmount}</p>
        </div>
        <p>Please review your expenses and adjust your spending accordingly.</p>
        <p>Best regards,<br>Your Finance Tracker Team</p>
      </div>
    `,
  };
};

const sendEmailAlert = async ({ email, subject, message, budget, spent }) => {
  try {
    // Input validation
    if (!email) {
      throw new Error('Email address is required');
    }

    // Create transporter
    const transporter = createTransporter();

    // Create email content
    const emailContent = createEmailContent({ subject, message, budget, spent });

    const mailOptions = {
      from: {
        name: 'Finance Tracker',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Save the email alert to the database
    const newEmailAlert = new EmailAlert({
      email,
      subject: emailContent.subject,
      message: emailContent.text,
      sentAt: new Date(),
      messageId: info.messageId,
      budget,
      spent,
    });

    await newEmailAlert.save();

    return { 
      success: true, 
      message: "Email alert sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email alert:", error);
    
    // Save failed attempt to database for monitoring
    try {
      const failedAlert = new EmailAlert({
        email,
        subject: subject || 'Budget Alert',
        message: message || 'Budget exceeded alert',
        sentAt: new Date(),
        error: error.message,
        status: 'failed',
        budget,
        spent,
      });
      await failedAlert.save();
    } catch (dbError) {
      console.error("Error saving failed email alert:", dbError);
    }

    return { 
      success: false, 
      error: error.message,
      details: error.response || error.stack,
    };
  }
};

// API endpoint to manually send an email alert
const sendEmailAlertEndpoint = async (req, res) => {
  try {
    const { email, subject, message, budget, spent } = req.body;
    
    // Validate request
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const result = await sendEmailAlert({ email, subject, message, budget, spent });

    if (result.success) {
      res.status(200).json({ 
        message: "Email alert sent and logged successfully.",
        messageId: result.messageId,
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Email alert endpoint error:", error);
    res.status(500).json({ 
      error: error.message,
      details: error.response || error.stack,
    });
  }
};

module.exports = { sendEmailAlert, sendEmailAlertEndpoint };
