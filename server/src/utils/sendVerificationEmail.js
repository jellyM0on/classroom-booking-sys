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
            <p>Hi,</p>
            <p>To verify your Iskolaroom account, click the link below and set your password:</p>
            <a href="${resetLink}">Set Password</a>
        `,
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
