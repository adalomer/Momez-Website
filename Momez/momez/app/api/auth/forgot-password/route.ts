import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db/mysql'
import { sendPasswordResetEmail } from '@/lib/email'

// Generate 6-digit reset code
function generateResetCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json()

		if (!email) {
			return NextResponse.json(
				{ success: false, error: 'Email is required' },
				{ status: 400 }
			)
		}

		// Check if user exists
		const [users]: any = await pool.execute(
			'SELECT id, email, full_name FROM users WHERE email = ?',
			[email.toLowerCase()]
		)

		if (!users || users.length === 0) {
			// Don't reveal if email exists or not for security
			return NextResponse.json({ success: true, message: 'If an account exists with this email, a reset code has been sent' })
		}

		const user = users[0]

		// Generate reset code
		const resetCode = generateResetCode()
		const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

		// Store reset code in database (drop and recreate table for proper schema)
		try {
			// Drop existing table if it has wrong schema
			await pool.execute('DROP TABLE IF EXISTS password_resets')
			await pool.execute(
				`CREATE TABLE password_resets (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          reset_code VARCHAR(6) NOT NULL,
          expires_at DATETIME NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_user_id (user_id),
          INDEX idx_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
			)
		} catch (e) {
			// Table creation failed, try to continue anyway
			console.warn('Table creation warning:', e)
		}

		// Delete old reset codes for this user
		await pool.execute('DELETE FROM password_resets WHERE user_id = ?', [user.id])

		// Insert new reset code
		await pool.execute(
			'INSERT INTO password_resets (user_id, reset_code, expires_at) VALUES (?, ?, ?)',
			[user.id, resetCode, expiresAt]
		)

		// Send email
		const emailResult = await sendPasswordResetEmail(email, resetCode)

		if (!emailResult.success) {
			console.error('Failed to send reset email:', emailResult.error)
			return NextResponse.json(
				{ success: false, error: 'Failed to send email. Please try again later.' },
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			message: 'Reset code sent to your email'
		})

	} catch (error: any) {
		console.error('Forgot password error:', error)
		return NextResponse.json(
			{ success: false, error: 'An error occurred' },
			{ status: 500 }
		)
	}
}
