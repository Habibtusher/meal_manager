import nodemailer from 'nodemailer';
import {
  welcomeEmailTemplate,
  memberWelcomeEmailTemplate,
  lowBalanceAlertTemplate,
} from './email-templates';

const APP_NAME = process.env.APP_NAME || 'Meal Manager';

/**
 * Create a reusable SMTP transporter
 * Configured from environment variables
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Generic email sending function
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  // Skip sending if SMTP credentials are not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] SMTP credentials not configured. Skipping email send to:', to);
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"${APP_NAME}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[Email] Successfully sent "${subject}" to ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`[Email] Failed to send "${subject}" to ${to}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send welcome email to a self-registered admin (organization creator)
 * Fire-and-forget: does not throw on failure
 */
export async function sendWelcomeEmail(
  name: string,
  email: string,
  organizationName: string
): Promise<void> {
  const html = welcomeEmailTemplate(name, organizationName);
  await sendEmail(email, `Welcome to ${APP_NAME}! 🎉`, html);
}

/**
 * Send welcome email to a member added by an admin (includes credentials)
 * Fire-and-forget: does not throw on failure
 */
export async function sendMemberAddedWelcomeEmail(
  name: string,
  email: string,
  password: string,
  organizationName: string
): Promise<void> {
  const html = memberWelcomeEmailTemplate(name, email, password, organizationName);
  await sendEmail(email, `You've been added to ${organizationName} on ${APP_NAME}`, html);
}

/**
 * Send low balance alert email to a member
 * Returns result so the caller can show feedback
 */
export async function sendLowBalanceAlertEmail(
  name: string,
  email: string,
  balance: number,
  organizationName: string
): Promise<{ success: boolean; error?: string }> {
  const html = lowBalanceAlertTemplate(name, balance, organizationName);
  return sendEmail(email, `⚠️ Low Balance Alert — ${APP_NAME}`, html);
}
