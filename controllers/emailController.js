const nodemailer = require("nodemailer");
require("dotenv").config();

const trasnporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEmailPass = async (email, pass, name) => {
  try {
    let info = await trasnporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Recuperación de contraseña de Memo's Pinturas`,
      html: `<h1>Recuperación de contraseña</h1>
      <p>Estimado ${name}</p>
      <p>La contraseña de tu cuenta es: ${pass}</p>
      <p>Atentamente</p>
      <p>El equipo de Memo's Pinturas</p>`,
    });

    console.log(`Correo enviado ${info.messageId}`);
  } catch (error) {
    console.error(`Error al enviar el correo ${error}`);
  }
};

module.exports = { sendEmailPass };