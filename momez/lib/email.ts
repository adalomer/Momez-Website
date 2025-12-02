import nodemailer from 'nodemailer'

// Gmail SMTP transporter
// Gmail için "App Password" oluşturmanız gerekiyor:
// 1. Google Hesabınıza gidin: https://myaccount.google.com/
// 2. Güvenlik > 2 Adımlı Doğrulama'yı açın
// 3. Güvenlik > Uygulama Şifreleri'ne gidin
// 4. "Posta" ve "Diğer" seçip bir şifre oluşturun
// 5. Bu şifreyi GMAIL_APP_PASSWORD olarak .env'e ekleyin

// Lazy initialization - runtime'da environment variable'ları okur
function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  
  console.log('[Email] Creating transporter with user:', user ? `${user.substring(0, 5)}...` : 'NOT SET')
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  
  console.log('[Email] sendEmail called, GMAIL_USER:', gmailUser ? 'SET' : 'NOT SET', 'GMAIL_APP_PASSWORD:', gmailPass ? 'SET' : 'NOT SET')
  
  if (!gmailUser || !gmailPass) {
    console.error('[Email] Gmail credentials not configured!')
    return { success: false, error: 'Email credentials not configured' }
  }
  
  const transporter = getTransporter()
  
  try {
    // Transporter'ı doğrula
    try {
      await transporter.verify()
      console.log('[Email] Transporter verified successfully')
    } catch (verifyError: any) {
      console.warn('[Email] Transporter verify failed:', verifyError?.message || verifyError)
    }

    const info = await transporter.sendMail({
      from: `"Momez" <${gmailUser}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })

    console.log('[Email] Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    const errMsg = (error && error.message) ? error.message : String(error)
    console.error('[Email] Send error:', errMsg)
    return { success: false, error: errMsg }
  }
}

// Şifre sıfırlama e-postası gönder
export async function sendPasswordResetEmail(email: string, resetCode: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Şifre Sıfırlama</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 32px 32px 24px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Momez</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 600;">
                    Şifre Sıfırlama Kodu
                  </h2>
                  <p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6;">
                    Merhaba,<br><br>
                    Şifrenizi sıfırlamak için aşağıdaki kodu kullanın. Bu kod <strong>30 dakika</strong> geçerlidir.
                  </p>
                  
                  <!-- Code Box -->
                  <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                    <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #92400e; letter-spacing: 8px;">
                      ${resetCode}
                    </span>
                  </div>
                  
                  <p style="margin: 24px 0 0; color: #71717a; font-size: 13px; line-height: 1.5;">
                    Bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Bu e-posta Momez tarafından otomatik olarak gönderilmiştir.<br>
                    Lütfen bu e-postayı yanıtlamayın.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `
Momez - Şifre Sıfırlama

Merhaba,

Şifrenizi sıfırlamak için aşağıdaki kodu kullanın:

${resetCode}

Bu kod 30 dakika geçerlidir.

Bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.

Momez Ekibi
  `

  return sendEmail({
    to: email,
    subject: 'Momez - Şifre Sıfırlama Kodu',
    html,
    text,
  })
}

// Sipariş onay e-postası (örnek - ileride kullanılabilir)
export async function sendOrderConfirmationEmail(email: string, orderNumber: string, total: number) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Sipariş Onayı</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px;">
              <tr>
                <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Momez</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px;">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <div style="width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                      <span style="font-size: 32px;">✓</span>
                    </div>
                  </div>
                  <h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; text-align: center;">
                    Siparişiniz Alındı!
                  </h2>
                  <p style="color: #52525b; text-align: center;">
                    Sipariş Numarası: <strong>${orderNumber}</strong><br>
                    Toplam: <strong>${total.toFixed(2)} TL</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Momez - Siparişiniz Alındı #${orderNumber}`,
    html,
  })
}
