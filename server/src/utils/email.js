const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"PathForward Myanmar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - PathForward Myanmar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">PathForward Myanmar</h1>
          </div>
          
          <h2 style="color: #1F2937; margin-bottom: 20px;">Welcome to PathForward Myanmar!</h2>
          
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Thank you for registering with PathForward Myanmar. We're excited to have you join our community connecting Myanmar's youth to their future.
          </p>
          
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 14px 32px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #3B82F6; word-break: break-all; font-size: 14px; background-color: #F3F4F6; padding: 10px; border-radius: 4px;">
            ${verificationUrl}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
              <strong>Note:</strong> This link will expire in 24 hours for security reasons.
            </p>
            <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
              If you didn't create an account with PathForward Myanmar, please ignore this email.
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #9CA3AF; font-size: 12px;">
            <p>© ${new Date().getFullYear()} PathForward Myanmar. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"PathForward Myanmar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - PathForward Myanmar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">PathForward Myanmar</h1>
          </div>
          
          <h2 style="color: #1F2937; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            You requested to reset your password for your PathForward Myanmar account.
          </p>
          
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Click the button below to proceed with resetting your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 14px 32px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #3B82F6; word-break: break-all; font-size: 14px; background-color: #F3F4F6; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #DC2626; font-size: 14px; line-height: 1.6;">
              <strong>Security Notice:</strong> This link will expire in 1 hour.
            </p>
            <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
              If you didn't request a password reset, please ignore this email and your password will remain unchanged. 
              We recommend changing your password if you believe your account may have been compromised.
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #9CA3AF; font-size: 12px;">
            <p>© ${new Date().getFullYear()} PathForward Myanmar. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: `"PathForward Myanmar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to PathForward Myanmar!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">PathForward Myanmar</h1>
          </div>
          
          <h2 style="color: #1F2937; margin-bottom: 20px;">Welcome, ${firstName}! 🎉</h2>
          
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Your email has been successfully verified! You're now part of the PathForward Myanmar community.
          </p>
          
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Here's what you can do next:
          </p>
          
          <ul style="color: #4B5563; font-size: 16px; line-height: 1.8;">
            <li>Complete your profile to stand out</li>
            <li>Browse available opportunities</li>
            <li>Connect with companies and universities</li>
            <li>Start building your career path</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/login" 
               style="display: inline-block; padding: 14px 32px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Get Started
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
              If you have any questions or need assistance, feel free to reach out to our support team.
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #9CA3AF; font-size: 12px;">
            <p>© ${new Date().getFullYear()} PathForward Myanmar. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
