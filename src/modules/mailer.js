const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

require('dotenv').config();

const mailParams = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
}

const transport = nodemailer.createTransport(mailParams);

transport.use(
  'compile',
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./src/resources/mail/'),
    },
    extName: '.html',
    viewPath: path.resolve('./src/resources/mail/'),
  })
);

module.exports = transport;
