"use server";

import { transporter } from "@/lib/email";

export async function sendContactEmail(formData: { name: string; email: string; message: string }) {
  const { name, email, message } = formData;

  if (!name || !email || !message) {
    return { success: false, error: "Missing fields" };
  }

  try {
    const mailOptions = {
      from: process.env.JANAKA_EMAIL,
      to: process.env.JANAKA_EMAIL || "janakachamith99@gmail.com",
      replyTo: email,
      subject: `New Portfolio Contact from ${name}`,
      text: `You received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2>New Portfolio Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #9333ea; background: #f9f9f9;">
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
             </div>`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}

