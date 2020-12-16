import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  ignoreTLS: true,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendRegConfirmationMail = (email: string, additionalProp: { token: string }) => {
  const mailDetails = {
    from: process.env.EMAIL_LOGIN,
    to: email,
    subject: 'test',
    text: additionalProp.token
  };

  transporter.sendMail(mailDetails, (error, info) => {
    if (error) {
      return;
    }
  });
};

export default {
  sendRegConfirmationMail
};
