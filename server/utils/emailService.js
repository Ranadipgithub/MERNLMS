const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

transporter.verify((err, success) => {
  if (err) console.error("Email transporter error:", err);
  else console.log("Email transporter ready");
});

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
