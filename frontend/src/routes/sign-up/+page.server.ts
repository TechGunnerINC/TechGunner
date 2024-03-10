import type { Actions } from './$types'
import axios from '$lib/axios.config'
import { redirect } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData()
		const username = data.get('username')
		const password = data.get('password')
		const email = data.get('email')
		const name = data.get('name')

		const res = await axios.post('auth/sign-up', {
			email,
			password,
			username,
			name
		})

		cookies.set('auth', res.data.token, {
			httpOnly: true,
			secure: true,
			priority: 'high',
			path: '/'
		})

		redirect(308, `/profile/${res.data.user.username}`)
	}
}
