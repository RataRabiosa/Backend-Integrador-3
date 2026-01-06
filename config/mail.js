import nodemailer from 'nodemailer';

const gmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mercadopresosrl@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD
  },
});


export default gmail;