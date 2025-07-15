import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
      },
    } as SMTPTransport.Options);
    const info = await transporter.sendMail({
      from: "noreply@" + process.env.MAILTRAP_SMTP_HOST,
      to,
      subject,
      text,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error, "Mailer Error");
    throw error;
  }
};
