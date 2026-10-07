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

export interface MonthSettlementEmailParams {
  name: string;
  organizationName: string;
  month: number;
  year: number;
  mealsConsumed: number;
  mealRate: number;
  totalMealCost: number;
  totalSharedCost: number;
  totalCost: number;
  totalDeposited: number;
  netBalance: number;
  isContinuing: boolean;
  actionTaken: string;
  notes?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Month Settlement Statement email sent to each member when a month is closed
 */
export function monthSettlementEmailTemplate(data: MonthSettlementEmailParams): string {
  const monthName = MONTH_NAMES[data.month - 1];
  const nextMonth = data.month === 12 ? 1 : data.month + 1;
  const nextYear = data.month === 12 ? data.year + 1 : data.year;
  const nextMonthName = MONTH_NAMES[nextMonth - 1];

  const isSurplus = data.netBalance > 0.01;
  const isDue = data.netBalance < -0.01;

  const headerContent = `
    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
      📋 Month Settlement Statement
    </h1>
    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 15px;">
      ${monthName} ${data.year} &bull; ${data.organizationName}
    </p>
  `;

  // Status & Action message
  let actionMessage = '';
  if (data.isContinuing) {
    if (isSurplus) {
      actionMessage = `
        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.5;">
            <strong>✓ Next Month:</strong> You are continuing into <strong>${nextMonthName} ${nextYear}</strong>. 
            Your surplus of <strong>${formatCurrency(data.netBalance)}</strong> has been automatically carried forward as your <strong>Opening Deposit</strong> on 1st ${nextMonthName}.
          </p>
        </div>
      `;
    } else if (isDue) {
      actionMessage = `
        <div style="background-color: #fff1f2; border-left: 4px solid #f43f5e; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #9f1239; font-size: 14px; line-height: 1.5;">
            <strong>⚠️ Opening Due:</strong> You are continuing into <strong>${nextMonthName} ${nextYear}</strong>. 
            Your unpaid balance of <strong>${formatCurrency(Math.abs(data.netBalance))}</strong> has been carried forward and will be adjusted from your first deposit in ${nextMonthName}.
          </p>
        </div>
      `;
    } else {
      actionMessage = `
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.5;">
            <strong>✓ Balanced:</strong> Your account is fully settled at ৳0.00 for ${monthName}.
          </p>
        </div>
      `;
    }
  } else {
    // Exiting mess
    if (isSurplus) {
      actionMessage = `
        <div style="background-color: #fefce8; border-left: 4px solid #eab308; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.5;">
            <strong>🚪 Exit Settlement:</strong> Your final refund of <strong>${formatCurrency(data.netBalance)}</strong> has been processed in cash/bKash and your account has been settled.
          </p>
        </div>
      `;
    } else if (isDue) {
      actionMessage = `
        <div style="background-color: #fff7ed; border-left: 4px solid #f97316; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #9a3412; font-size: 14px; line-height: 1.5;">
            <strong>🚪 Exit Settlement:</strong> Your final due of <strong>${formatCurrency(Math.abs(data.netBalance))}</strong> has been resolved upon exit and your account has been settled.
          </p>
        </div>
      `;
    } else {
      actionMessage = `
        <div style="background-color: #f1f5f9; border-left: 4px solid #64748b; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.5;">
            <strong>🚪 Exit Settlement:</strong> Your account was settled with zero remaining balance upon exit.
          </p>
        </div>
      `;
    }
  }

  const netBalanceBox = isSurplus
    ? `
      <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0 0 6px; color: #047857; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
          Surplus / Extra Balance (উদ্বৃত্ত)
        </p>
        <p style="margin: 0; color: #059669; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
          +${formatCurrency(data.netBalance)}
        </p>
      </div>
    `
    : isDue
    ? `
      <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0 0 6px; color: #b91c1c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
          Due / Unpaid Balance (বকেয়া)
        </p>
        <p style="margin: 0; color: #dc2626; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
          ${formatCurrency(data.netBalance)}
        </p>
      </div>
    `
    : `
      <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0 0 6px; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
          Balanced
        </p>
        <p style="margin: 0; color: #334155; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
          ৳0.00
        </p>
      </div>
    `;

  const notesSection = data.notes
    ? `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          Manager's Notes
        </p>
        <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.5;">
          ${data.notes}
        </p>
      </div>
    `
    : '';

  const bodyContent = `
    <p style="margin: 0 0 14px; color: #334155; font-size: 16px; line-height: 1.6;">
      Hi <strong>${data.name}</strong>,
    </p>
    <p style="margin: 0 0 20px; color: #475569; font-size: 14px; line-height: 1.6;">
      The monthly accounts for <strong>${monthName} ${data.year}</strong> in <strong>"${data.organizationName}"</strong> have been audited and officially settled. Here is your final summary statement:
    </p>

    ${netBalanceBox}

    ${actionMessage}

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 24px;">
      <div style="padding: 12px 16px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
        <h3 style="margin: 0; color: #334155; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">
          Account Breakdown
        </h3>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Total Meals Consumed:</td>
          <td style="padding: 10px 16px; color: #0f172a; text-align: right; font-weight: 600;">${data.mealsConsumed}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Final Meal Rate:</td>
          <td style="padding: 10px 16px; color: #0f172a; text-align: right; font-weight: 600;">${formatCurrency(data.mealRate)} / meal</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Total Meal Cost:</td>
          <td style="padding: 10px 16px; color: #0f172a; text-align: right; font-weight: 600;">${formatCurrency(data.totalMealCost)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Shared / Room Cost:</td>
          <td style="padding: 10px 16px; color: #0f172a; text-align: right; font-weight: 600;">${formatCurrency(data.totalSharedCost)}</td>
        </tr>
        <tr style="border-bottom: 2px solid #e2e8f0; background-color: #f8fafc;">
          <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">Total Month Cost:</td>
          <td style="padding: 12px 16px; color: #dc2626; text-align: right; font-weight: 800;">${formatCurrency(data.totalCost)}</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">Total Deposited:</td>
          <td style="padding: 12px 16px; color: #059669; text-align: right; font-weight: 800;">${formatCurrency(data.totalDeposited)}</td>
        </tr>
      </table>
    </div>

    ${notesSection}

    <div style="text-align: center; margin: 28px 0 10px;">
      <a href="${APP_URL}/member/dashboard" 
         style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
        View Member Dashboard →
      </a>
    </div>
  `;

  return wrapTemplate(headerContent, bodyContent);
}

export interface DepositConfirmationEmailParams {
  name: string;
  organizationName: string;
  amount: number;
  description: string;
  previousBalance: number;
  newBalance: number;
  totalDeposited?: number;
  totalCost?: number;
  date: Date;
}

/**
 * Deposit confirmation email sent to a member when money is deposited to their wallet
 */
export function depositConfirmationEmailTemplate(data: DepositConfirmationEmailParams): string {
  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const headerContent = `
    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
      💰 Deposit Confirmed!
    </h1>
    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 15px;">
      ${data.organizationName}
    </p>
  `;

  const bodyContent = `
    <p style="margin: 0 0 16px; color: #334155; font-size: 16px; line-height: 1.6;">
      Hi <strong>${data.name}</strong>,
    </p>
    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
      A deposit of <strong>${formatCurrency(data.amount)}</strong> has been successfully added to your wallet in <strong>"${data.organizationName}"</strong>.
    </p>

    <!-- Highlight Card -->
    <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 6px; color: #047857; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
        Amount Deposited
      </p>
      <p style="margin: 0; color: #059669; font-size: 36px; font-weight: 800; letter-spacing: -0.5px;">
        +${formatCurrency(data.amount)}
      </p>
      <p style="margin: 8px 0 0; color: #065f46; font-size: 13px;">
        Date: ${formattedDate}
      </p>
    </div>

    <!-- Details Table -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 24px;">
      <div style="padding: 12px 16px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
        <h3 style="margin: 0; color: #334155; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">
          Transaction Receipt
        </h3>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Member:</td>
          <td style="padding: 10px 16px; color: #0f172a; text-align: right; font-weight: 600;">${data.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Description:</td>
          <td style="padding: 10px 16px; color: #0f172a; text-align: right; font-weight: 600;">${data.description}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #047857; font-weight: 600;">Credit Added:</td>
          <td style="padding: 10px 16px; color: #059669; text-align: right; font-weight: 700;">+${formatCurrency(data.amount)}</td>
        </tr>
        ${data.totalDeposited !== undefined ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Total Deposited (This Month):</td>
          <td style="padding: 10px 16px; color: #0f172a; text-align: right; font-weight: 700;">${formatCurrency(data.totalDeposited)}</td>
        </tr>` : ''}
        ${data.totalCost !== undefined && data.totalCost > 0 ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Meals & Costs (To Date):</td>
          <td style="padding: 10px 16px; color: #dc2626; text-align: right; font-weight: 600;">-${formatCurrency(data.totalCost)}</td>
        </tr>` : ''}
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 16px; color: #64748b;">Previous Balance:</td>
          <td style="padding: 10px 16px; color: #64748b; text-align: right; font-weight: 600;">${formatCurrency(data.previousBalance)}</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">Current Month Balance:</td>
          <td style="padding: 12px 16px; color: ${data.newBalance < 0 ? '#dc2626' : '#2563eb'}; text-align: right; font-weight: 800; font-size: 16px;">${formatCurrency(data.newBalance)}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 24px;">
      <p style="margin: 0; color: #166534; font-size: 13px; line-height: 1.5;">
        ✓ This transaction has been permanently recorded in your ledger. You can view your full history anytime in your dashboard.
      </p>
    </div>

    <div style="text-align: center; margin: 28px 0 10px;">
      <a href="${APP_URL}/member/dashboard" 
         style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
        View Wallet & Dashboard →
      </a>
    </div>
  `;

  return wrapTemplate(headerContent, bodyContent);
}


