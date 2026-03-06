import nodemailer from "nodemailer";
const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transport.sendMail({
      from: `"MorphDeck Support" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    throw new Error("Email could not be sent", { cause: error });
  }
};

export default sendEmail;
