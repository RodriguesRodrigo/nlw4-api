import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

class SendMailService {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });

            this.client = transporter;
        });
    }

    async execute(to: string, subject: string, body: string, path: string) {
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse({
            name: to,
            title: subject,
            description: body,
        });

        const message = await this.client.sendMail({
            to,
            subject,
            html: html,
            from: "NPS <noreply@nps.com.br>"
        });

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();
