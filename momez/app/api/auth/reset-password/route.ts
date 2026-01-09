import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db/mysql'
import { hashPassword } from '@/lib/auth'

// POST /api/auth/reset-password - Reset password with code
export async function POST(request: NextRequest) {
	try {
		const { email, code, newPassword } = await request.json()

		if (!email || !code || !newPassword) {
			return NextResponse.json(
				{ success: false, error: 'Email, code and new password are required' },
				{ status: 400 }
			)
		}

		if (newPassword.length < 6) {
			return NextResponse.json(
				{ success: false, error: 'Password must be at least 6 characters' },
				{ status: 400 }
			)
		}

		// Find user
		const [users]: any = await pool.execute(
			'SELECT id FROM users WHERE email = ?',
			[email.toLowerCase()]
		)

		if (!users || users.length === 0) {
			return NextResponse.json(
				{ success: false, error: 'Invalid email or code' },
				{ status: 400 }
			)
		}

		const user = users[0]

		// Check reset code
		const [resets]: any = await pool.execute(
			'SELECT * FROM password_resets WHERE user_id = ? AND reset_code = ? AND used = FALSE AND expires_at > NOW()',
			[user.id, code]
		)

		if (!resets || resets.length === 0) {
			return NextResponse.json(
				{ success: false, error: 'Invalid or expired reset code' },
				{ status: 400 }
			)
		}

		// Hash new password
		const hashedPassword = await hashPassword(newPassword)

		// Update password
		await pool.execute(
			'UPDATE users SET password = ? WHERE id = ?',
			[hashedPassword, user.id]
		)

		// Mark reset code as used
		await pool.execute(
			'UPDATE password_resets SET used = TRUE WHERE user_id = ?',
			[user.id]
		)

		return NextResponse.json({
			success: true,
			message: 'Password updated successfully'
		})

	} catch (error: any) {
		console.error('Reset password error:', error)
		return NextResponse.json(
			{ success: false, error: 'An error occurred' },
			{ status: 500 }
		)
	}
}
