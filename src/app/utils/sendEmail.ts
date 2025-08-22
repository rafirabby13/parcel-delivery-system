/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs"
const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    host: envVars.EMAIL_SENDER.SMTP_HOST,

});


interface EmailOptions {
    to: string;       // recipient's email
    subject: string;  // email subject
    template: string,
    templateData?: Record<string, any>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string,

    }[]     // HTML content
}

export const sendEmail = async ({ to, subject, template, attachments, templateData }: EmailOptions) => {

    try {
        const templatePath = path.join(__dirname, `templates/${template}.ejs`)

        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM, // sender
            to: to,                // receiver
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        });

        console.log("Email sent:", info);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


