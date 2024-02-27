import type { Actions } from './$types'
import axios from '../../axios.config'
import { redirect } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData()
		const username = data.get('username')
		const password = data.get('password')
		const email = data.get('email')
		let name = data.get('name')

		if (!name) {
			name = username
		}

		const info = await axios.post(
			'auth/sign-up',
			{
				email,
				password,
				username,
				name
			},
			{ withCredentials: true }
		)

		cookies.set('auth', info.data.token, {
			httpOnly: true,
			secure: true,
			priority: 'high',
			path: '/'
		})

		redirect(308, `/profile/${info.data.user.username}`)
	}
}
