const nodemailer = require("nodemailer");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");

const templatesDir = path.join(__dirname, "../templates");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: false,
    auth: config.email.smtp.auth,
  });
};

const sendEmail = async (to, subject, text, html) => {
  const transporter = createTransporter();

  const message = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(message);
};

const sendWelcomeEmail = async (user) => {
  const subject = "Welcome to re-estore";
  const text = `Hello ${user.name},\n\nWelcome to our platform!`;
  const html = fs
    .readFileSync(path.join(templatesDir, "welcome.html"), "utf-8")
    .replace(/{{NAME}}/g, user.name)
    .replace(/{{ACTIVATION_LINK}}/g, user.activationLink)
    .replace(/{{DASHBOARD_LINK}}/g, user.dashboardLink)
    .replace(/{{SUPPORT_LINK}}/g, user.supportLink)
    .replace(/{{SHOP_LINK}}/g, user.shopLink)
    .replace(/{{UNSUBSCRIBE_LINK}}/g, user.unsubscribeLink);

  await sendEmail(user.email, subject, text, html);
};

const sendPasswordResetEmail = async (user, token) => {
  const subject = "Password Reset Request";
  const text = `Hello ${user.name},\n\nYou requested a password reset. Use this token: ${token}`;
  const html = `<h1>Password Reset</h1><p>Hello ${user.name}</p><p>Use this token: <strong>${token}</strong></p>`;

  await sendEmail(user.email, subject, text, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
