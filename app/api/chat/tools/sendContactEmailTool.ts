/**
 * Tool: sendContactEmail
 *
 * Sends a contact inquiry email from a portfolio visitor to Janaka's personal inbox.
 *
 * IMPORTANT — Human-in-the-Loop (HITL):
 * The orchestrator must confirm with the user before calling this tool.
 * It should ONLY call this tool when it has collected ALL of:
 *   - visitor name
 *   - visitor email
 *   - visitor message
 * If any field is missing, the orchestrator asks the user first (defined in system prompt).
 *
 * Phase 5 will add a formal LangGraph interrupt() checkpoint here.
 *
 * Flow:
 *   orchestrator collects name + email + message from conversation
 *     → calls this tool
 *     → nodemailer sends email to JANAKA_EMAIL
 *     → returns success/failure string to orchestrator
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { transporter } from "@/lib/email";

export const sendContactEmailTool = tool(
  async ({
    visitorName,
    visitorEmail,
    message,
  }: {
    visitorName: string;
    visitorEmail: string;
    message: string;
  }) => {
    const janakaEmail = process.env.JANAKA_EMAIL;

    if (!janakaEmail) {
      console.error("[sendContactEmail] JANAKA_EMAIL env var is not set.");
      return "Unable to send email — email configuration is missing. Please contact Janaka directly.";
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@janaka-portfolio.com",
      to: janakaEmail,
      replyTo: visitorEmail,
      subject: `📬 New Portfolio Inquiry from ${visitorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #0070f3; padding-bottom: 10px;">
            New Portfolio Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; font-weight: bold; background: #f5f5f5; width: 30%;">Name</td>
              <td style="padding: 10px;">${visitorName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; background: #f5f5f5;">Email</td>
              <td style="padding: 10px;"><a href="mailto:${visitorEmail}">${visitorEmail}</a></td>
            </tr>
          </table>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0070f3; margin: 20px 0;">
            <strong>Message:</strong>
            <p style="margin: 10px 0 0 0;">${message}</p>
          </div>
          <p style="color: #888; font-size: 12px;">
            Sent via Janaka's portfolio AI agent. Reply directly to this email to respond to ${visitorName}.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return `✅ Your message has been sent to Janaka! He'll get back to you at ${visitorEmail} soon.`;
    } catch (error) {
      console.error("[sendContactEmail] Failed to send:", error);
      // Log the inquiry so it's not lost even if email fails
      console.log("[sendContactEmail] Lost inquiry:", { visitorName, visitorEmail, message });
      return "⚠️ There was an issue sending the email. Please try reaching Janaka directly via LinkedIn or email.";
    }
  },
  {
    name: "sendContactEmail",
    description:
      "Send a contact inquiry email from a portfolio visitor to Janaka. Only call this tool when you have collected the visitor's name, email address, AND their message. Never call this with missing fields.",
    schema: z.object({
      visitorName: z.string().describe("The visitor's full name"),
      visitorEmail: z
        .string()
        .email()
        .describe("The visitor's email address to reply to"),
      message: z
        .string()
        .min(10)
        .describe("The visitor's message or inquiry to send to Janaka"),
    }),
  }
);
