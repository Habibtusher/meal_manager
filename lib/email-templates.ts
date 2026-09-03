/**
 * HTML email templates for Meal Manager
 * All templates use inline CSS for maximum email client compatibility
 */

const APP_NAME = process.env.APP_NAME || 'Meal Manager';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

const baseStyles = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7fa;
  margin: 0;
  padding: 0;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
`;

const headerStyles = `
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  padding: 40px 32px;
  text-align: center;
`;

const contentStyles = `
  padding: 32px;
`;

const footerStyles = `
  background-color: #f8fafc;
  padding: 24px 32px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
`;

function wrapTemplate(headerContent: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
</head>
<body style="${baseStyles}">
  <div style="padding: 32px 16px;">
    <div style="${containerStyles}">
      <!-- Header -->
      <div style="${headerStyles}">
        ${headerContent}
      </div>

      <!-- Content -->
      <div style="${contentStyles}">
        ${bodyContent}
      </div>

      <!-- Footer -->
      <div style="${footerStyles}">
        <p style="margin: 0; color: #94a3b8; font-size: 13px;">
          &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
        </p>
        <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
          This is an automated email. Please do not reply directly.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Welcome email for self-registered admins (organization creators)
 */
export function welcomeEmailTemplate(name: string, organizationName: string): string {
  const headerContent = `
    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
      🎉 Welcome to ${APP_NAME}!
    </h1>
    <p style="margin: 12px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">
      Your organization is ready to go
    </p>
  `;

  const bodyContent = `
    <p style="margin: 0 0 16px; color: #334155; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
      Congratulations! Your organization <strong>"${organizationName}"</strong> has been created successfully. 
      You are now the admin and can start managing meals, members, and expenses right away.
    </p>

    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #ede9fe 100%); border-radius: 10px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #4338ca; font-size: 16px;">🚀 Quick Start Guide</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #475569; font-size: 14px; vertical-align: top;">
            <strong style="color: #6366f1;">1.</strong> Add your members from the Members page
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #475569; font-size: 14px; vertical-align: top;">
            <strong style="color: #6366f1;">2.</strong> Set up meal schedules and track attendance
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #475569; font-size: 14px; vertical-align: top;">
            <strong style="color: #6366f1;">3.</strong> Record expenses and manage wallets
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/login" 
         style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
        Go to Dashboard →
      </a>
    </div>
  `;

  return wrapTemplate(headerContent, bodyContent);
}

/**
 * Welcome email for members added by an admin (includes credentials)
 */
export function memberWelcomeEmailTemplate(
  name: string,
  email: string,
  password: string,
  organizationName: string
): string {
  const headerContent = `
    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
      👋 Welcome Aboard!
    </h1>
    <p style="margin: 12px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">
      You've been added to ${organizationName}
    </p>
  `;

  const bodyContent = `
    <p style="margin: 0 0 16px; color: #334155; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
      You've been added as a member of <strong>"${organizationName}"</strong> on ${APP_NAME}. 
      Use the credentials below to log in and start tracking your meals.
    </p>

    <div style="background-color: #fefce8; border: 1px solid #fde047; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #854d0e; font-size: 15px;">🔐 Your Login Credentials</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #713f12; font-size: 14px; width: 100px; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0; color: #92400e; font-size: 14px; font-family: monospace;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #713f12; font-size: 14px; width: 100px; font-weight: 600;">Password:</td>
          <td style="padding: 8px 0; color: #92400e; font-size: 14px; font-family: monospace;">${password}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #fff7ed; border-left: 4px solid #f97316; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; color: #9a3412; font-size: 13px; line-height: 1.5;">
        ⚠️ <strong>Security Notice:</strong> Please change your password after your first login 
        by visiting your Profile page.
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/login" 
         style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
        Login Now →
      </a>
    </div>
  `;

  return wrapTemplate(headerContent, bodyContent);
}

/**
 * Low balance alert email
 */
import { formatCurrency } from '@/lib/utils';

export function lowBalanceAlertTemplate(
  name: string,
  balance: number,
  organizationName: string
): string {
  const formattedBalance = formatCurrency(balance);

  const headerContent = `
    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
      ⚠️ Low Balance Alert
    </h1>
    <p style="margin: 12px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">
      Action needed for your ${organizationName} account
    </p>
  `;

  const bodyContent = `
    <p style="margin: 0 0 16px; color: #334155; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
      This is a reminder that your wallet balance in <strong>"${organizationName}"</strong> is running low. 
      Please deposit funds to continue tracking your meals smoothly.
    </p>

    <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 1px solid #fecaca; border-radius: 12px; padding: 28px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: #991b1b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
        Current Balance
      </p>
      <p style="margin: 0; color: #dc2626; font-size: 36px; font-weight: 800; letter-spacing: -1px;">
        ${formattedBalance}
      </p>
    </div>

    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.5;">
        💡 <strong>Tip:</strong> Contact your mess admin to add a deposit to your wallet 
        so your meal tracking stays up to date.
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/login" 
         style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
        View Dashboard →
      </a>
    </div>
  `;

  return wrapTemplate(headerContent, bodyContent);
}
