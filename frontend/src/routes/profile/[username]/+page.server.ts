import type { PageServerLoad } from './$types'
import axios from '$lib/axios.config'

export const load = (async ({ url }) => {
	const res = await axios.get(`${url.pathname}`)
	const user = res.data.user

	return { user }
}) satisfies PageServerLoad
