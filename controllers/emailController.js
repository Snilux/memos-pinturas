const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;
try {

  transporter = nodemailer.createTransport({
    service: "gmail", // Explicitly use the Gmail service
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address from .env
      pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
    },

  });
  // --- End of Gmail specific configuration ---

  // Verify transporter connection (optional, good for startup check)
  transporter.verify(function (error, success) {
    if (error) {
      console.error("Error verifying transporter configuration:", error);
      // Common Gmail errors: incorrect App Password, "Less secure app access" issues (if not using App Password)
      console.error(
        "For Gmail, ensure you are using an App Password if 2-Step Verification is enabled."
      );
    } else {
      console.log(
        "Nodemailer transporter is configured correctly for Gmail. Ready to send emails."
      );
    }
  });
} catch (error) {
  console.error("Failed to create Nodemailer transporter:", error);
  console.error("Ensure EMAIL_USER and EMAIL_PASS are set in your .env file.");
  // Handle the error appropriately, maybe exit the app if email is critical
}

// --- Email Sending Function (Contact Form) ---
// Takes the contact form data and sends the email
const sendMailContact = async (name, email, message) => {
  console.log("Attempting to send contact email...");
  console.log(`Data: Name=${name}, Email=${email}, Message=${message}`);

  // Check if transporter was created successfully
  if (!transporter) {
    console.error("Cannot send email because transporter is not configured.");
    return false; // Indicate failure
  }

  // Define email content and options
  const mailOptions = {
    from: `"Memo's Pinturas Contacto" <${process.env.EMAIL_USER}>`, // Sender display name and address
    to: process.env.EMAIL_USER, // Where you want to receive the contact emails
    replyTo: email, // Set the reply-to field to the sender's email address
    subject: `Nuevo Mensaje de Contacto de: ${name}`, // Subject line
    text: `Has recibido un nuevo mensaje de tu formulario de contacto:\n\nNombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`, // Plain text body
    html: `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>Nuevo Mensaje de Contacto</h2>
                <p>Has recibido un nuevo mensaje a través del formulario de contacto de tu sitio web.</p>
                <hr>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Mensaje:</strong></p>
                <p style="white-space: pre-wrap; background-color: #f9f9f9; border: 1px solid #eee; padding: 10px;">${message}</p>
                <hr>
                <p><small>Este correo fue enviado automáticamente desde tu formulario de contacto.</small></p>
            </div>
        `, // HTML body (using pre-wrap for message formatting)
  };

  // Send the email using the transporter
  try {
    console.log("Sending contact email with options:", mailOptions);
    let info = await transporter.sendMail(mailOptions);
    console.log("Contact email sent successfully!");
    console.log("Message sent: %s", info.messageId);
    return true; // Indicate success
  } catch (error) {
    console.error("Error occurred while sending contact email:", error);
    return false; // Indicate failure
  }
};

// --- Email Sending Function (Password Recovery) ---
// Takes user email, new password, and name to send recovery info
const sendEmailPass = async (email, pass, name) => {
  console.log("Attempting to send password recovery email...");
  console.log(`Data: Email=${email}, Name=${name}`); // Avoid logging password

  // Check if transporter was created successfully
  if (!transporter) {
    console.error("Cannot send email because transporter is not configured.");
    // Consider throwing an error or returning a specific failure indicator
    return false;
  }

  try {
    // Define email options for password recovery
    const mailOptionsPass = {
      from: `"Memo's Pinturas Soporte" <${process.env.EMAIL_USER}>`, // Use a relevant sender name
      to: email, // Send to the user's email address
      subject: `Recuperación de contraseña de Memo's Pinturas`,
      html: `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h1>Recuperación de contraseña</h1>
                <p>Estimado/a ${name},</p>
                <p>Hemos recibido una solicitud para recuperar la contraseña de tu cuenta.</p>
                <p>Tu contraseña es: <strong>${pass}</strong></p>
                <br>
                <p>Atentamente,</p>
                <p>El equipo de Memo's Pinturas</p>
            </div>
            `, // Added more context and security advice
      // Optionally add a plain text version
      text: `Recuperación de contraseña\n\nEstimado/a ${name},\n\nHemos recibido una solicitud para recuperar la contraseña de tu cuenta.\nTu contraseña temporal es: ${pass}\n\nPor favor, inicia sesión y cambia tu contraseña lo antes posible por motivos de seguridad.\n\nAtentamente,\nEl equipo de Memo's Pinturas`,
    };

    console.log("Sending password recovery email to:", email);
    let info = await transporter.sendMail(mailOptionsPass);
    console.log(
      `Password recovery email sent successfully to ${email}. Message ID: ${info.messageId}`
    );
    return true; // Indicate success
  } catch (error) {
    console.error(
      `Error sending password recovery email to ${email}: ${error}`
    );
    return false; // Indicate failure
  }
};

module.exports = { sendEmailPass, sendMailContact };
