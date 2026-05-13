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

// Email templates for different languages
const emailTemplates = {
	en: {
		passwordReset: {
			subject: 'Momez - Password Reset Code',
			title: 'Password Reset Code',
			greeting: 'Hello,',
			message: 'Use the following code to reset your password. This code is valid for <strong>30 minutes</strong>.',
			warning: 'If you did not make this request, you can ignore this email. Your account is secure.',
			footer: 'This email was sent automatically by Momez.',
			footerNote: 'Please do not reply to this email.'
		},
		orderConfirmation: {
			subject: 'Momez - Order Received',
			title: 'Your Order Has Been Received!',
			orderNumber: 'Order Number',
			total: 'Total'
		}
	},
	ar: {
		passwordReset: {
			subject: 'مومز - رمز إعادة تعيين كلمة المرور',
			title: 'رمز إعادة تعيين كلمة المرور',
			greeting: 'مرحباً،',
			message: 'استخدم الرمز التالي لإعادة تعيين كلمة المرور الخاصة بك. هذا الرمز صالح لمدة <strong>30 دقيقة</strong>.',
			warning: 'إذا لم تقم بهذا الطلب، يمكنك تجاهل هذا البريد الإلكتروني. حسابك آمن.',
			footer: 'تم إرسال هذا البريد الإلكتروني تلقائياً بواسطة مومز.',
			footerNote: 'يرجى عدم الرد على هذا البريد الإلكتروني.'
		},
		orderConfirmation: {
			subject: 'مومز - تم استلام الطلب',
			title: 'تم استلام طلبك!',
			orderNumber: 'رقم الطلب',
			total: 'المجموع'
		}
	}
}

type Language = 'en' | 'ar'

// Şifre sıfırlama e-postası gönder
export async function sendPasswordResetEmail(email: string, resetCode: string, language: Language = 'en') {
	const t = emailTemplates[language]?.passwordReset || emailTemplates.en.passwordReset
	const dir = language === 'ar' ? 'rtl' : 'ltr'
	const textAlign = language === 'ar' ? 'right' : 'left'

	const html = `
    <!DOCTYPE html>
    <html dir="${dir}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
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
                <td style="padding: 32px; text-align: ${textAlign};">
                  <h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 600;">
                    ${t.title}
                  </h2>
                  <p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6;">
                    ${t.greeting}<br><br>
                    ${t.message}
                  </p>
                  
                  <!-- Code Box -->
                  <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                    <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #92400e; letter-spacing: 8px;">
                      ${resetCode}
                    </span>
                  </div>
                  
                  <p style="margin: 24px 0 0; color: #71717a; font-size: 13px; line-height: 1.5;">
                    ${t.warning}
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    ${t.footer}<br>
                    ${t.footerNote}
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
Momez - ${t.title}

${t.greeting}

${t.message.replace(/<[^>]*>/g, '')}

${resetCode}

${t.warning}

${t.footer}
  `

	return sendEmail({
		to: email,
		subject: t.subject,
		html,
		text,
	})
}

// Sipariş onay e-postası (örnek - ileride kullanılabilir)
export async function sendOrderConfirmationEmail(email: string, orderNumber: string, total: number, language: Language = 'en') {
	const t = emailTemplates[language]?.orderConfirmation || emailTemplates.en.orderConfirmation
	const dir = language === 'ar' ? 'rtl' : 'ltr'

	const html = `
    <!DOCTYPE html>
    <html dir="${dir}">
    <head>
      <meta charset="utf-8">
      <title>${t.title}</title>
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
                    ${t.title}
                  </h2>
                  <p style="color: #52525b; text-align: center;">
                    ${t.orderNumber}: <strong>${orderNumber}</strong><br>
                    ${t.total}: <strong>${total.toFixed(2)}</strong>
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
		subject: `${t.subject} #${orderNumber}`,
		html,
	})
}
