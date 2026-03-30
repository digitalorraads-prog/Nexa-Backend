// config/emailConfig.js
const { Resend } = require('resend');

/**
 * Sends email to admin using Resend.com
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
    const adminEmail = process.env.ADMIN_EMAIL || 'nexainfotech1@gmail.com';

    console.log(`📤 Sending email from: ${fromEmail} to: ${adminEmail}`);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Nexa Website <${fromEmail}>`,
      to: [adminEmail],
      subject: 'nexa infotech new contact form',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Segoe UI, Arial, sans-serif; line-height: 1.4; background-color: #f9f9f9; margin: 0; padding: 10px; }
            .container { max-width: 550px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #eee; }
            .header { background: #030712; color: #22d3ee; padding: 20px; text-align: center; border-bottom: 2px solid #22d3ee; }
            .header h2 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
            .content { padding: 20px; }
            .details { background: #fdfdfd; border: 1px solid #f0f0f0; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
            .field { margin-bottom: 8px; font-size: 14px; }
            .label { font-weight: 600; color: #666; width: 80px; display: inline-block; }
            .value { color: #000; }
            .message-label { color: #030712; font-weight: bold; margin: 15px 0 5px 0; font-size: 15px; }
            .message-box { background: #f0f9ff; padding: 12px; border-radius: 4px; border-left: 3px solid #0891b2; font-size: 14px; color: #333; }
            .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Inquiry Received</h2>
            </div>
            
            <div class="content">
              <div class="details">
                <div class="field">
                  <span class="label">Name:</span>
                  <span class="value">${name}</span>
                </div>
                
                <div class="field">
                  <span class="label">Email:</span>
                  <span class="value">${email}</span>
                </div>
                
                <div class="field">
                  <span class="label">Phone:</span>
                  <span class="value">${phone || 'N/A'}</span>
                </div>
                
                <div class="field" style="margin-bottom: 0;">
                  <span class="label">Date:</span>
                  <span class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>
              </div>

              <div class="message-label">Message:</div>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <div class="footer">
                <p>Nexa Info Tech - Contact Form Notification</p>
                <p>&copy; ${new Date().getFullYear()} Nexa. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        nexa infotech new contact form
        
        Name: ${name}
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