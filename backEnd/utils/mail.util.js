import transporter from "../config/transporter.config.js"


export const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: process.env.GMAIL_USER, 
        to,
        subject,
        html,
    };

    try {
        console.log('Enviando correo a:', to); 
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};