import nodemailer from "nodemailer";

const smtpConfig = {
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
};

export const transporter = nodemailer.createTransport(smtpConfig);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@janaka-portfolio.com",
    to: email,
    subject: "Reset Your Password - Portfolio Admin",
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 20px;color:#fff;background-color:#0070f3;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <br />
      <p>Or copy and paste this URL into your browser:</p>
      <p>${resetLink}</p>
    `,
  };

  console.log("=========================================");
  console.log("PASSWORD RESET LINK:");
  console.log(resetLink);
  console.log("=========================================");

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email. Check your SMTP settings in .env.");
    console.error(error);
    // In development or if SMTP isn't set up yet, we still return true so the user can use the link printed above!
    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      return { success: true };
    }
    return { success: false, error: "Failed to send reset email" };
  }
};
