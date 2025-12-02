// Basit e-posta test scripti
// Kullanım: ROOT dizinde `node scripts/test-email.js` çalıştırın

require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

async function run() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  const to = process.env.TEST_SEND_TO || user

  if (!user || !pass) {
    console.error('Lütfen .env.local içine GMAIL_USER ve GMAIL_APP_PASSWORD ekleyin')
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  })

  try {
    const ok = await transporter.verify()
    console.log('Transporter verify OK:', ok)
  } catch (err) {
    console.warn('Transporter verify failed:', err && err.message ? err.message : err)
  }

  try {
    const info = await transporter.sendMail({
      from: `"Momez Test" <${user}>`,
      to,
      subject: 'Test E-postası - Momez',
      text: 'Bu bir test e-postasıdır. Eğer alıyorsanız e-posta ayarlarınız doğru çalışıyor.'
    })

    console.log('SendMail result:', info.messageId)
  } catch (err) {
    console.error('SendMail error:', err && err.message ? err.message : err)
  }
}

run()
