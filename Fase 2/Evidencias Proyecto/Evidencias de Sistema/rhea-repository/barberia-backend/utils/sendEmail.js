// archivo: utils/sendEmail.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
// Función para enviar correos usando plantillas dinámicas
const sendEmail = async (to, templateId, dynamicData) => {
  const msg = {
    to, // Correo del receptor
    from: 'rheareserve@gmail.com', // 
    templateId, // ID de la plantilla dinámica en SendGrid
    dynamic_template_data: dynamicData // Datos dinámicos que se pasarán a la plantilla
  };   
  try {
    await sgMail.send(msg);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar correo:', error.response ? error.response.body.errors : error.message);
    throw new Error('No se pudo enviar el correo');
  }
};
module.exports = sendEmail;