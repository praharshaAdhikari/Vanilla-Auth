const nodemailer = require('nodemailer');
const user = process.env.AUTH_EMAIL
const pass = process.env.AUTH_PASSWORD

const nodemailerTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass }
});

nodemailerTransporter.verify((error, success) => {
  if (error) console.log(error);
  else {
    console.log("Nodemailer is ready for verification.");
  };
});

module.exports = nodemailerTransporter