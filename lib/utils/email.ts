import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import config from './config';

/* ---------------------------------------------------
   Path: Email Templates Directory
---------------------------------------------------- */
const templatesDir = path.join(process.cwd(), 'lib/templates');

/* ---------------------------------------------------
   Create Nodemailer Transporter
---------------------------------------------------- */
function createTransporter() {
  return nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: false,
    auth: config.email.smtp.auth,
  });
}

/* ---------------------------------------------------
   Generic Send Email Function
---------------------------------------------------- */
export async function sendEmail(to: string, subject: string, text: string, html: string) {
  const transporter = createTransporter();

  const message = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(message);
}

/* ---------------------------------------------------
   Send Welcome Email
---------------------------------------------------- */
export interface WelcomeEmailData {
  name: string;
  email: string;
  activationLink: string;
  dashboardLink: string;
  supportLink: string;
  shopLink: string;
  unsubscribeLink: string;
}

export async function sendWelcomeEmail(user: WelcomeEmailData) {
  const filePath = path.join(templatesDir, 'welcome.html');

  const subject = 'Welcome to re-estore';
  const text = `Hello ${user.name},\n\nWelcome to our platform!`;

  const htmlTemplate = fs.readFileSync(filePath, 'utf-8');

  const html = htmlTemplate
    .replace(/{{NAME}}/g, user.name)
    .replace(/{{ACTIVATION_LINK}}/g, user.activationLink)
    .replace(/{{DASHBOARD_LINK}}/g, user.dashboardLink)
    .replace(/{{SUPPORT_LINK}}/g, user.supportLink)
    .replace(/{{SHOP_LINK}}/g, user.shopLink)
    .replace(/{{UNSUBSCRIBE_LINK}}/g, user.unsubscribeLink);

  await sendEmail(user.email, subject, text, html);
}

/* ---------------------------------------------------
   Send Password Reset Email
---------------------------------------------------- */
export interface ResetEmailData {
  name: string;
  email: string;
  resetLink: string;
}

export async function sendPasswordResetEmail(user: ResetEmailData) {
  const filePath = path.join(templatesDir, 'reset-password.html');

  const subject = 'Password Reset Request';
  const text = `Hello ${user.name},\n\nYou requested a password reset.`;

  const htmlTemplate = fs.readFileSync(filePath, 'utf-8');

  const html = htmlTemplate
    .replace(/{{NAME}}/g, user.name)
    .replace(/{{RESET_LINK}}/g, user.resetLink);

  await sendEmail(user.email, subject, text, html);
}
