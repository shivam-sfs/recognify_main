const nodeMailer = require("nodemailer");

/* -------------------------------------------------------------------------- */
/*                                 Nodemailer                                 */
/* -------------------------------------------------------------------------- */

async function mailer(email, subject, text) {
  console.log(
    process.env.SMTP_SERVICE,
    process.env.USER,
    process.env.EMAIL_PASSWORD
  );
  try {
    const transporter = nodeMailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject,
      text,
      html: text,
    };

    return await transporter.sendMail(mailOptions, (e) => {
      if (e) {
        return false;
      } else {
        return true;
      }
    });
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  mailer,
};
