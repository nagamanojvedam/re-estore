const nodemailer = require("nodemailer");
const config = require("../config/config");

const createTransporter = () => {
  return nodemailer.createTransporter({
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
  const subject = "Welcome to re-estore Backend API";
  const text = `Hello ${user.name},\n\nWelcome to our platform!`;
  const html = `<h1>Hello ${user.name}</h1><p>Welcome to our platform!</p>`;

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
