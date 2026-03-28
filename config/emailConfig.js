// config/emailConfig.js
const { Resend } = require('resend');

/**
 * Admin ko email bhejta hai using Resend.com
 */
const sendAdminEmail = async ({ name, email, phone, message }) => {
  try {
    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY missing in .env file');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Default from email (Resend verified domain or onboarding email)
    // IMPORTANT: Users should verify their own domain for production
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const adminEmail = process.env.ADMIN_EMAIL || 'sainirakesh3221@gmail.com';

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Nexa Website <${fromEmail}>`,
      to: [adminEmail],
      subject: '🔔 Naya Contact Form Submission - Nexa',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .field { margin-bottom: 15px; border-bottom: 1px solid #dee2e6; padding-bottom: 10px; }
            .field:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .label { font-weight: 600; color: #495057; min-width: 100px; display: inline-block; }
            .value { color: #212529; }
            .message-box { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📬 Naya Contact Form Message</h2>
            </div>
            
            <div class="content">
              <div class="details">
                <div class="field">
                  <span class="label">👤 Naam:</span>
                  <span class="value"><strong>${name}</strong></span>
                </div>
                
                <div class="field">
                  <span class="label">📧 Email:</span>
                  <span class="value">${email}</span>
                </div>
                
                <div class="field">
                  <span class="label">📞 Phone:</span>
                  <span class="value">${phone || 'N/A'}</span>
                </div>
                
                <div class="field">
                  <span class="label">⏰ Time:</span>
                  <span class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>
              </div>

              <h3 style="color: #495057;">💬 Message:</h3>
              <div class="message-box">
                <p style="margin: 0;">${message}</p>
              </div>
              
              <div class="footer">
                <p>⚠️ Yeh email Resend.com ke zariye bheji gayi hai</p>
                <p>&copy; ${new Date().getFullYear()} Nexa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Naya Contact Form Message
        
        Naam: ${name}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        Time: ${new Date().toLocaleString()}
        
        Message:
        ${message}
      `
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Admin email sent via Resend. ID:', data.id);
    return { success: true, messageId: data.id };
    
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendAdminEmail };