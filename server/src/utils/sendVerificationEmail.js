import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { ValidationError } from "../validators/userValidator.js";

dotenv.config();

export const sendSetPasswordVerificationEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // TODO: Create file for email template
  const mailOptions = {
  from: `${process.env.SMTP_SENDER}`,
  to: toEmail,
  subject: "Iskolaroom Account Verification",
 html: `
  <div style="font-family: 'Segoe UI', sans-serif; background: #fff; padding: 32px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #111827;">Iskolaroom Account Verification</h2>
    <p>Hi,</p>
    <p>To verify your Iskolaroom account, click below:</p>
    <p style="text-align: center;">
      <a href="${resetLink}" style="padding: 12px 20px; background-color: #111827; color: #fff; text-decoration: none; border-radius: 5px;">
        Set Password
      </a>
    </p>
    <p>If you didn’t request this, ignore this email.</p>
    <p style="font-size: 12px; color: #888;">&copy; 2025 Iskolaroom</p>
  </div>
`
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new ValidationError(
      JSON.stringify([
        { path: "send-mail", message: "Error sending password reset email" },
      ])
    );
  }
};
